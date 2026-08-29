import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChatSocket } from "./useChatSocket.ts";
import { mockSocket } from "../../../test/mocks/socket.ts";
import { fetchAndCacheMessageSuggestions } from "../lib/messageSuggestions.ts";
import type { ChatItem, ChatMessagesResponse, DirectMessage } from "@linguachat/shared";
import { chatMessagesQueryKey } from "../api/chatApi.ts";

vi.mock("../lib/messageSuggestions", () => ({
    fetchAndCacheMessageSuggestions: vi.fn(),
}));

vi.mock("../../auth/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
        data: { id: 1, name: "Me", photo: "me.jpg", hasSeenOnboarding: true },
        isLoading: false,
    }),
}));

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useChatSocket Hook", () => {
    let queryClient: QueryClient;
    const currentUser = { id: 1, name: "Me", photo: "me.jpg" };

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        queryClient.setQueryData(["current-user"], currentUser);
        mockSocket.__reset();
        vi.clearAllMocks();
    });

    const mockChat: ChatItem = {
        id: "chat-1",
        type: "Direct",
        isFavourite: false,
        name: "Alice",
        photo: "alice.jpg",
        lastMessage: {
            id: "msg-0",
            content: "old message",
            created_at: new Date().toISOString(),
            sender: { id: 2, name: "Alice" },
            statuses: [{ userId: 1, status: "Delivered" }],
            suggestions: null,
        },
        unreadCount: 2,
    };

    it("swaps optimistic message with server message on NEW_MESSAGE if client_id matches", () => {
        const initialMessages: ChatMessagesResponse = {
            type: "Direct",
            messages: [
                {
                    id: "optimistic-123",
                    client_id: null,
                    chatId: "chat-1",
                    content: "optimistic hello",
                    createdAt: new Date(),
                    senderId: 1,
                    recieverId: 2,
                    status: "UnDelivered",
                    suggestions: null,
                },
            ],
            nextCursor: null,
        };

        queryClient.setQueryData(chatMessagesQueryKey("chat-1"), {
            pages: [initialMessages],
            pageParams: [null],
        });

        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        const serverMessage: DirectMessage = {
            id: "msg-1234",
            client_id: "optimistic-123",
            chatId: "chat-1",
            content: "optimistic hello",
            createdAt: new Date(),
            senderId: 1,
            recieverId: 2,
            status: "Delivered",
            suggestions: null,
        };

        mockSocket.__trigger("new-message", serverMessage);

        const cached = queryClient.getQueryData<{ pages: ChatMessagesResponse[] }>(
            chatMessagesQueryKey("chat-1"),
        );
                expect(cached?.pages[0].messages).toHaveLength(1);
        expect(cached?.pages[0].messages[0].id).toBe("msg-1234");
        expect((cached?.pages[0].messages[0] as DirectMessage).status).toBe("Delivered");
    });

    it("prepends new message on NEW_MESSAGE if no matching client_id is found", () => {
        const initialMessages: ChatMessagesResponse = {
            type: "Direct",
            messages: [],
            nextCursor: null,
        };

        queryClient.setQueryData(chatMessagesQueryKey("chat-1"), {
            pages: [initialMessages],
            pageParams: [null],
        });

        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        const incomingMsg: DirectMessage = {
            id: "msg-999",
            client_id: null,
            chatId: "chat-1",
            content: "incoming from server",
            createdAt: new Date(),
            senderId: 2,
            recieverId: 1,
            status: "Delivered",
            suggestions: null,
        };

        mockSocket.__trigger("new-message", incomingMsg);

        const cached = queryClient.getQueryData<{ pages: ChatMessagesResponse[] }>(
            chatMessagesQueryKey("chat-1"),
        );
        expect(cached?.pages[0].messages).toHaveLength(1);
        expect(cached?.pages[0].messages[0].id).toBe("msg-999");
    });

    it("updates chats list unreadCount and lastMessage on NEW_MESSAGE", () => {
        queryClient.setQueryData<ChatItem[]>(["chats"], [mockChat]);

        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        const incomingMsg: DirectMessage = {
            id: "msg-999",
            client_id: null,
            chatId: "chat-1",
            content: "incoming hello",
            createdAt: new Date(),
            senderId: 2,
            recieverId: 1,
            status: "Delivered",
            suggestions: null,
        };

        mockSocket.__trigger("new-message", incomingMsg);

        const cachedChats = queryClient.getQueryData<ChatItem[]>(["chats"]);
        expect(cachedChats?.[0].unreadCount).toBe(3);
        expect(cachedChats?.[0].lastMessage.content).toBe("incoming hello");
    });

    it("triggers fetchAndCacheMessageSuggestions on NEW_MESSAGE when conditions are met", () => {
        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        const incomingMsg: DirectMessage = {
            id: "msg-999",
            client_id: null,
            chatId: "chat-1",
            content: "incoming hello",
            createdAt: new Date(),
            senderId: 2,
            recieverId: 1,
            status: "Read",
            suggestions: null,
        };

        mockSocket.__trigger("new-message", incomingMsg);

        expect(fetchAndCacheMessageSuggestions).toHaveBeenCalledWith(
            queryClient,
            "chat-1",
            "msg-999",
        );
    });

    it("does NOT trigger suggestions if message was sent by current user", () => {
        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        const myMsg: DirectMessage = {
            id: "msg-999",
            client_id: null,
            chatId: "chat-1",
            content: "sent by me",
            createdAt: new Date(),
            senderId: 1,
            recieverId: 2,
            status: "Read",
            suggestions: null,
        };

        mockSocket.__trigger("new-message", myMsg);

        expect(fetchAndCacheMessageSuggestions).not.toHaveBeenCalled();
    });

    it("handles OPEN_CHAT event to mark chat and messages as Read", () => {
        // Setup direct chat where receiver is Alice (id: 2) and last message status is Delivered
        const myChat: ChatItem = {
            ...mockChat,
            lastMessage: {
                ...mockChat.lastMessage,
                statuses: [{ userId: 2, status: "Delivered" }],
            },
        };

        queryClient.setQueryData<ChatItem[]>(["chats"], [myChat]);

        const initialMessages: ChatMessagesResponse = {
            type: "Direct",
            messages: [
                {
                    id: "msg-123",
                    client_id: null,
                    chatId: "chat-1",
                    content: "hello",
                    createdAt: new Date(),
                    senderId: 1, // Sent by me
                    recieverId: 2,
                    status: "Delivered",
                    suggestions: null,
                },
            ],
            nextCursor: null,
        };

        queryClient.setQueryData(chatMessagesQueryKey("chat-1"), {
            pages: [initialMessages],
            pageParams: [null],
        });

        renderHook(() => useChatSocket(), {
            wrapper: createWrapper(queryClient),
        });

        // Simulate Alice (id: 2) opening the chat
        mockSocket.__trigger("open-chat", {
            chatId: "chat-1",
            userId: 2,
        });

        const cachedChats = queryClient.getQueryData<ChatItem[]>(["chats"]);
        expect(cachedChats?.[0].lastMessage.statuses[0].status).toBe("Read");
    });
});
