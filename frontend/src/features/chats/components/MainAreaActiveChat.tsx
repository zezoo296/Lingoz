import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import { CHAT_EVENTS } from "@linguachat/shared";
import type { NewMessageInput } from "@linguachat/shared";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { RiArrowLeftLine, RiChat3Line } from "react-icons/ri";
import { socket } from "../../../sockets/socket";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { chatMessagesQueryKey, getChatMessages } from "../api/chatApi";
import MessageList from "./MessageList";
import { useQueryClient } from "@tanstack/react-query";
import { createOptimisticMessage } from "../lib/helpers";

interface MainAreaActiveChatProps {
    activeChatId: string;
    selectedChat: ChatItem;
    onBackToList?: () => void;
}

export default function MainAreaActiveChat({
    activeChatId,
    selectedChat,
    onBackToList,
}: MainAreaActiveChatProps) {
    const { data: currentUser } = useCurrentUser();
    if (!currentUser) return null;
    const { data: messages, isPending } = useQuery({
        queryKey: chatMessagesQueryKey(activeChatId),
        queryFn: () => getChatMessages(activeChatId, 1, 20),
    });
    const messageRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const chatType = selectedChat.type;

    const sendMessageHandler = () => {
        if (!messageRef.current?.value) return;

        const newMessage = createOptimisticMessage(
            chatType,
            activeChatId,
            messageRef.current.value,
            currentUser,
        );

        //Update chat messages
        queryClient.setQueryData(
            chatMessagesQueryKey(activeChatId),
            (old: ChatMessagesResponse) => {
                if (!old) return old;

                return {
                    ...old,
                    messages: [newMessage, ...old.messages],
                };
            },
        );

        //Update chatList
        queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats) => {
            if (!oldChats) return oldChats;

            return oldChats.map((chatItem) => {
                if (chatItem.id !== activeChatId) {
                    return chatItem;
                }

                return {
                    ...chatItem,
                    lastMessage: {
                        content: newMessage.content,
                        created_at: newMessage.createdAt.toISOString(),
                        sender: {
                            id: currentUser.id,
                            name: currentUser.name || "unknown",
                        },
                        statuses: [],
                    },
                };
            });
        });

        const newMessageEvent: NewMessageInput = {
            id: newMessage.id,
            chatId: activeChatId,
            content: messageRef.current.value,
        };

        socket.emit(CHAT_EVENTS.NEW_MESSAGE, newMessageEvent);

        messageRef.current.value = "";
    };

    return (
        <div className="flex-1 flex flex-col bg-background h-[calc(100vh-68.8px)]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface/50">
                <button
                    onClick={onBackToList}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-elevated transition-colors text-text-secondary"
                    aria-label="Back to chat list"
                >
                    <RiArrowLeftLine className="w-5 h-5" />
                </button>

                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    {selectedChat.photo ? (
                        <img
                            src={selectedChat.photo}
                            alt={selectedChat.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-brand-500 font-semibold">
                            {selectedChat.name.charAt(0) || "?"}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary truncate">
                        {selectedChat.name}
                    </p>
                    {selectedChat.type === "Group" && (
                        <p className="text-xs text-text-muted">Group chat</p>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
                {isPending ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`h-12 rounded-2xl w-2/3 ${i % 2 === 0 ? "bg-brand-500/20 rounded-br-md" : "bg-surface-elevated rounded-bl-md"}`}
                                />
                            </div>
                        ))}
                    </div>
                ) : !messages || messages.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-text-muted">
                        <div className="text-center">
                            <RiChat3Line className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs">
                                Start typing below to send a message
                            </p>
                        </div>
                    </div>
                ) : (
                    <MessageList
                        messages={messages.messages}
                        currentUserId={currentUser?.id}
                        directChatName={selectedChat.name}
                    />
                )}
            </div>

            <div className="p-3 sm:p-4 border-t border-border bg-surface/50">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        placeholder={`Message ${selectedChat.name || "..."}`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500 transition-colors"
                        ref={messageRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessageHandler();
                            }
                        }}
                    />
                    <button
                        className="px-4 sm:px-6 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors whitespace-nowrap"
                        onClick={sendMessageHandler}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
