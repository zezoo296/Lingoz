import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSendMessage } from "./useChatMessages.ts";
import { socket } from "../../../sockets/socket.ts";
import { mockSocket } from "../../../test/mocks/socket.ts";
import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import { chatMessagesQueryKey } from "../api/chatApi.ts";

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useSendMessage Hook", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        mockSocket.__reset();
    });

    const mockUser = { id: 1, name: "Me", photo: "me.jpg" };
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
            statuses: [],
            suggestions: null,
        },
        unreadCount: 0,
    };

    it("prepends optimistic message to message cache and emits socket event", () => {
        const initialMessages: ChatMessagesResponse = {
            type: "Direct",
            messages: [],
            nextCursor: null,
        };

        queryClient.setQueryData(chatMessagesQueryKey("chat-1"), {
            pages: [initialMessages],
            pageParams: [null],
        });

        const { result } = renderHook(() => useSendMessage("chat-1", "Direct"), {
            wrapper: createWrapper(queryClient),
        });

        const optimistic = result.current("Hello", mockUser, mockChat);

        const cached = queryClient.getQueryData<{ pages: ChatMessagesResponse[] }>(
            chatMessagesQueryKey("chat-1"),
        );
        expect(cached?.pages[0].messages).toHaveLength(1);
        expect(cached?.pages[0].messages[0].id).toBe(optimistic.id);
        expect(cached?.pages[0].messages[0].content).toBe("Hello");

        expect(socket.emit).toHaveBeenCalledWith("new-message", {
            id: optimistic.id,
            chatId: "chat-1",
            content: "Hello",
        });
    });

    it("updates existing chat lastMessage in chats list query cache", () => {
        queryClient.setQueryData<ChatItem[]>(["chats"], [mockChat]);

        const { result } = renderHook(() => useSendMessage("chat-1", "Direct"), {
            wrapper: createWrapper(queryClient),
        });

        const optimistic = result.current("Hello", mockUser, mockChat);

        const cachedChats = queryClient.getQueryData<ChatItem[]>(["chats"]);
        expect(cachedChats).toHaveLength(1);
        expect(cachedChats?.[0].lastMessage.content).toBe("Hello");
        expect(cachedChats?.[0].lastMessage.id).toBe(optimistic.id);
    });

    it("prepends new chat to chats list if not already present", () => {
        queryClient.setQueryData<ChatItem[]>(["chats"], []);

        const { result } = renderHook(() => useSendMessage("chat-1", "Direct"), {
            wrapper: createWrapper(queryClient),
        });

        const optimistic = result.current("Hello", mockUser, mockChat);

        const cachedChats = queryClient.getQueryData<ChatItem[]>(["chats"]);
        expect(cachedChats).toHaveLength(1);
        expect(cachedChats?.[0].id).toBe("chat-1");
        expect(cachedChats?.[0].lastMessage.content).toBe("Hello");
        expect(cachedChats?.[0].lastMessage.id).toBe(optimistic.id);
    });

    it("properly sets correct fields for group chat type", () => {
        const groupChat: ChatItem = {
            ...mockChat,
            id: "chat-2",
            type: "Group",
        };

        const initialMessages: ChatMessagesResponse = {
            type: "Group",
            messages: [],
            nextCursor: null,
        };

        queryClient.setQueryData(chatMessagesQueryKey("chat-2"), {
            pages: [initialMessages],
            pageParams: [null],
        });

        const { result } = renderHook(() => useSendMessage("chat-2", "Group"), {
            wrapper: createWrapper(queryClient),
        });

        result.current("Hello team", mockUser, groupChat);

        const cached = queryClient.getQueryData<{ pages: ChatMessagesResponse[] }>(
            chatMessagesQueryKey("chat-2"),
        );
        const firstMsg = cached?.pages[0].messages[0];
        expect(firstMsg?.content).toBe("Hello team");
        expect(firstMsg).toHaveProperty("sender");
        expect((firstMsg as any).sender.id).toBe(mockUser.id);
    });
});
