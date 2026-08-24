import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import { chatMessagesQueryKey, getMessageSuggestions } from "../api/chatApi";

/**
 * Generates reply suggestions and stores them on the matching chat preview
 * and message cache entry.
 */
export async function fetchAndCacheMessageSuggestions(
    queryClient: QueryClient,
    chatId: string,
    messageId: string,
): Promise<ChatItem["lastMessage"]["suggestions"]> {
    try {
        const suggestions = await getMessageSuggestions(messageId);
        const messageSuggestions = { suggestions };

        queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats) =>
            oldChats?.map((chat) =>
                chat.id === chatId && chat.lastMessage.id === messageId
                    ? {
                          ...chat,
                          lastMessage: {
                              ...chat.lastMessage,
                              suggestions: messageSuggestions,
                          },
                      }
                    : chat,
            ),
        );

        queryClient.setQueryData<
            InfiniteData<ChatMessagesResponse, string | null>
        >(chatMessagesQueryKey(chatId), (oldMessages) => {
            if (!oldMessages) return oldMessages;

            return {
                ...oldMessages,
                pages: oldMessages.pages.map((page) => {
                    if (page.type === "Direct") {
                        return {
                            ...page,
                            messages: page.messages.map((message) =>
                                message.id === messageId
                                    ? {
                                          ...message,
                                          suggestions: messageSuggestions,
                                      }
                                    : message,
                            ),
                        };
                    }

                    return {
                        ...page,
                        messages: page.messages.map((message) =>
                            message.id === messageId
                                ? {
                                      ...message,
                                      suggestions: messageSuggestions,
                                  }
                                : message,
                        ),
                    };
                }),
            };
        });

        return messageSuggestions;
    } catch (error) {
        console.error(
            "Failed to generate suggestions for message:",
            messageId,
            error,
        );
        return null;
    }
}
