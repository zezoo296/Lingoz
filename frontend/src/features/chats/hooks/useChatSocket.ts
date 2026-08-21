import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    CHAT_EVENTS,
    type ChatOpenedEvent,
    type MessagesDeliveredEvent,
    type ChatItem,
    type ChatMessagesResponse,
    type DirectMessage,
    type GroupMessage,
} from "@linguachat/shared";

import { socket } from "../../../sockets/socket";
import { chatMessagesQueryKey } from "../api/chatApi";
import { isGroupMessage } from "../lib/helpers";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

type Message = DirectMessage | GroupMessage;

export function useChatSocket() {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUser();

    useEffect(() => {
        const handleNewMessage = (rawMessage: Message) => {
            const newMessage = {
                ...rawMessage,
                createdAt: new Date(rawMessage.createdAt),
            };
            const isSentByCurrentUser = isGroupMessage(newMessage)
                ? newMessage.sender.id === currentUser?.id
                : newMessage.senderId === currentUser?.id;
            const isReadByCurrentUser = isGroupMessage(newMessage)
                ? newMessage.statuses.some(
                      (status) =>
                          status.userId === currentUser?.id &&
                          status.status === "Read",
                  )
                : newMessage.status === "Read";
            /*
             * 1. Update the chat list
             */
            queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats: any) => {
                if (!oldChats) return oldChats;

                return oldChats.map((chatItem: ChatItem) => {
                    if (chatItem.id !== newMessage.chatId) {
                        return chatItem;
                    }

                    if (isGroupMessage(newMessage)) {
                        return {
                            ...chatItem,
                            lastMessage: {
                                content: newMessage.content,
                                created_at: newMessage.createdAt.toISOString(),
                                sender: {
                                    id: newMessage.sender.id,
                                    name: newMessage.sender.name ?? "",
                                },
                                statuses: newMessage.statuses.map((status) => ({
                                    userId: status.userId,
                                    status: status.status,
                                })),
                            },
                            unreadCount:
                                !isSentByCurrentUser && !isReadByCurrentUser
                                    ? chatItem.unreadCount + 1
                                    : chatItem.unreadCount,
                        };
                    }

                    return {
                        ...chatItem,
                        lastMessage: {
                            ...chatItem.lastMessage,
                            content: newMessage.content,
                            created_at: newMessage.createdAt.toISOString(),
                            sender: {
                                id: newMessage.senderId,
                                name: isSentByCurrentUser
                                    ? (currentUser?.name ?? "Unknown")
                                    : chatItem.name,
                            },
                            statuses: [
                                {
                                    userId:
                                        newMessage.senderId === currentUser?.id
                                            ? newMessage.recieverId
                                            : currentUser?.id,
                                    status: newMessage.status,
                                },
                            ],
                        },
                        unreadCount:
                            !isSentByCurrentUser && !isReadByCurrentUser
                                ? chatItem.unreadCount + 1
                                : chatItem.unreadCount,
                    };
                });
            });

            /*
             * 2. Update messages for the specific chat
             */
            queryClient.setQueryData<ChatMessagesResponse>(
                chatMessagesQueryKey(newMessage.chatId),
                (oldMessages) => {
                    if (!oldMessages) {
                        return oldMessages;
                    }

                    if (oldMessages.type === "Direct") {
                        if (isGroupMessage(newMessage)) {
                            return oldMessages;
                        }

                        const optimisticIndex = oldMessages.messages.findIndex(
                            (message) => message.id === newMessage.client_id,
                        );

                        if (optimisticIndex !== -1) {
                            const messages = [...oldMessages.messages];
                            messages[optimisticIndex] = newMessage;

                            return {
                                ...oldMessages,
                                messages,
                            };
                        }

                        return {
                            ...oldMessages,
                            messages: [newMessage, ...oldMessages.messages],
                        };
                    }

                    // Group chat
                    if (!isGroupMessage(newMessage)) {
                        return oldMessages;
                    }

                    const optimisticIndex = oldMessages.messages.findIndex(
                        (message) => message.id === newMessage.client_id,
                    );

                    if (optimisticIndex !== -1) {
                        const messages = [...oldMessages.messages];
                        messages[optimisticIndex] = newMessage;

                        return {
                            ...oldMessages,
                            messages,
                        };
                    }

                    return {
                        ...oldMessages,
                        messages: [newMessage, ...oldMessages.messages],
                    };
                },
            );
        };

        const handleChatOpened = ({ chatId, userId }: ChatOpenedEvent) => {
            //ChatList
            queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats) => {
                if (!oldChats) return oldChats;

                return oldChats.map((chat) =>
                    chat.id === chatId
                        ? {
                              ...chat,
                              lastMessage: {
                                  ...chat.lastMessage,
                                  statuses: chat.lastMessage.statuses.map(
                                      (status) =>
                                          status.userId === userId
                                              ? {
                                                    ...status,
                                                    status: "Read" as const,
                                                }
                                              : status,
                                  ),
                              },
                          }
                        : chat,
                );
            });

            //Messages
            queryClient.setQueryData<ChatMessagesResponse>(
                chatMessagesQueryKey(chatId),
                (oldMessages) => {
                    if (!oldMessages) return oldMessages;

                    if (oldMessages.type === "Direct") {
                        if (!currentUser || currentUser.id === userId) {
                            return oldMessages;
                        }

                        return {
                            ...oldMessages,
                            messages: oldMessages.messages.map((message) =>
                                message.senderId === currentUser.id
                                    ? { ...message, status: "Read" as const }
                                    : message,
                            ),
                        };
                    }

                    return {
                        ...oldMessages,
                        messages: oldMessages.messages.map((message) => ({
                            ...message,
                            statuses: message.statuses.map((status) =>
                                status.userId === userId
                                    ? { ...status, status: "Read" as const }
                                    : status,
                            ),
                        })),
                    };
                },
            );
        };

        const handleMessagesDelivered = ({
            chatId,
            userId,
        }: MessagesDeliveredEvent) => {
            queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats) => {
                if (!oldChats) return oldChats;

                return oldChats.map((chat) =>
                    chat.id === chatId
                        ? {
                              ...chat,
                              lastMessage: {
                                  ...chat.lastMessage,
                                  statuses: chat.lastMessage.statuses.map(
                                      (status) =>
                                          status.userId === userId &&
                                          status.status === "UnDelivered"
                                              ? {
                                                    ...status,
                                                    status: "Delivered" as const,
                                                }
                                              : status,
                                  ),
                              },
                          }
                        : chat,
                );
            });

            queryClient.setQueryData<ChatMessagesResponse>(
                chatMessagesQueryKey(chatId),
                (oldMessages) => {
                    if (!oldMessages) return oldMessages;

                    if (oldMessages.type === "Direct") {
                        if (!currentUser || currentUser.id === userId) {
                            return oldMessages;
                        }

                        return {
                            ...oldMessages,
                            messages: oldMessages.messages.map((message) =>
                                message.senderId === currentUser.id &&
                                message.status === "UnDelivered"
                                    ? {
                                          ...message,
                                          status: "Delivered" as const,
                                      }
                                    : message,
                            ),
                        };
                    }

                    return {
                        ...oldMessages,
                        messages: oldMessages.messages.map((message) => ({
                            ...message,
                            statuses: message.statuses.map((status) =>
                                status.userId === userId &&
                                status.status === "UnDelivered"
                                    ? {
                                          ...status,
                                          status: "Delivered" as const,
                                      }
                                    : status,
                            ),
                        })),
                    };
                },
            );
        };

        socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
        socket.on(CHAT_EVENTS.OPEN_CHAT, handleChatOpened);
        socket.on(CHAT_EVENTS.MESSAGES_DELIVERED, handleMessagesDelivered);

        return () => {
            socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
            socket.off(CHAT_EVENTS.OPEN_CHAT, handleChatOpened);
            socket.off(CHAT_EVENTS.MESSAGES_DELIVERED, handleMessagesDelivered);
        };
    }, [currentUser, queryClient]);
}
