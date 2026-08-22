import {
    useInfiniteQuery,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";
import { useCallback } from "react";
import type {
    ChatItem,
    ChatMessagesResponse,
    NewMessageInput,
} from "@linguachat/shared";
import { CHAT_EVENTS } from "@linguachat/shared";
import { socket } from "../../../sockets/socket";
import { chatMessagesQueryKey, getChatMessages } from "../api/chatApi";
import {
    createOptimisticMessage,
    isGroupMessage,
} from "../lib/helpers";

export function useChatMessages(chatId: string) {
    return useInfiniteQuery<
        ChatMessagesResponse,
        Error,
        InfiniteData<ChatMessagesResponse>,
        ReturnType<typeof chatMessagesQueryKey>,
        string | null
    >({
        queryKey: chatMessagesQueryKey(chatId),
        queryFn: ({ pageParam }) => getChatMessages(chatId, pageParam, 20),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
}

// Match the exact shape createOptimisticMessage expects
interface CurrentUser {
    id: number;
    name: string | null;
    photo: string | null;
}

export function useSendMessage(chatId: string, chatType: "Direct" | "Group") {
    const queryClient = useQueryClient();

    const send = useCallback(
        (content: string, currentUser: CurrentUser) => {
            const optimisticMessage = createOptimisticMessage(
                chatType,
                chatId,
                content,
                currentUser,
            );

            // Update messages cache
            queryClient.setQueryData(
                chatMessagesQueryKey(chatId),
                (
                    old:
                        | InfiniteData<ChatMessagesResponse, string | null>
                        | undefined,
                ) => {
                    if (!old) return old;

                    const [firstPage, ...rest] = old.pages;

                    // Type guard: only add message to matching page type
                    const pageTypeMatches =
                        (chatType === "Direct" &&
                            firstPage.type === "Direct" &&
                            !isGroupMessage(optimisticMessage)) ||
                        (chatType === "Group" &&
                            firstPage.type === "Group" &&
                            isGroupMessage(optimisticMessage));

                    if (!pageTypeMatches) return old;

                    return {
                        ...old,
                        pages: [
                            {
                                ...firstPage,
                                messages: [
                                    optimisticMessage,
                                    ...firstPage.messages,
                                ],
                            },
                            ...rest,
                        ],
                    };
                },
            );

            // Update chat list
            queryClient.setQueryData<ChatItem[]>(["chats"], (old) =>
                old?.map((chat) =>
                    chat.id === chatId
                        ? {
                              ...chat,
                              lastMessage: {
                                  content,
                                  created_at:
                                      optimisticMessage.createdAt.toISOString(),
                                  sender: {
                                      id: currentUser.id,
                                      name: currentUser.name || "unknown",
                                  },
                                  statuses: [],
                              },
                          }
                        : chat,
                ),
            );

            socket.emit(CHAT_EVENTS.NEW_MESSAGE, {
                id: optimisticMessage.id,
                chatId,
                content,
            } satisfies NewMessageInput);

            return optimisticMessage;
        },
        [chatId, chatType, queryClient],
    );

    return send;
}
