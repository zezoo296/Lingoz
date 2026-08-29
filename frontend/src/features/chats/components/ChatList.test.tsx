import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../../test/test-utils";
import ChatList from "./ChatList";
import type { ChatItem } from "@linguachat/shared";

vi.mock("../../auth/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
        data: { id: 1, name: "Me", photo: null },
        isLoading: false,
    }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockChat = (overrides: Partial<ChatItem> = {}): ChatItem => ({
    id: "chat-1",
    type: "Direct",
    name: "Alice",
    photo: "",
    isFavourite: false,
    unreadCount: 0,
    lastMessage: {
        id: "msg-1",
        content: "Hello",
        created_at: new Date().toISOString(),
        sender: { id: 2, name: "Alice" },
        statuses: [{ userId: 1, status: "Read" }],
        suggestions: null,
    },
    ...overrides,
});

const defaultProps = {
    chats: [],
    activeChatId: undefined,
    onChatClick: vi.fn(),
    onNewChat: vi.fn(),
    onTabChange: vi.fn(),
    selectedTab: "All" as const,
    searchQuery: "",
    onSearchChange: vi.fn(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ChatList", () => {
    it("renders the empty state when chats array is empty", () => {
        renderWithProviders(<ChatList {...defaultProps} chats={[]} />);
        expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    });

    it("calls onNewChat when the empty-state button is clicked", async () => {
        const onNewChat = vi.fn();
        renderWithProviders(<ChatList {...defaultProps} chats={[]} onNewChat={onNewChat} />);
        fireEvent.click(screen.getByText("Start a new chat"));
        expect(onNewChat).toHaveBeenCalledTimes(1);
    });

    it("renders chat names when chats are provided", () => {
        const chats = [mockChat({ id: "c1", name: "Alice" }), mockChat({ id: "c2", name: "Bob" })];
        renderWithProviders(<ChatList {...defaultProps} chats={chats} />);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("calls onChatClick with the correct chat when a chat item is clicked", () => {
        const onChatClick = vi.fn();
        const chat = mockChat({ id: "c1", name: "Alice" });
        renderWithProviders(<ChatList {...defaultProps} chats={[chat]} onChatClick={onChatClick} />);
        fireEvent.click(screen.getByText("Alice"));
        expect(onChatClick).toHaveBeenCalledWith(chat);
    });

    it("calls onTabChange with 'Unread' when the Unread tab is clicked", () => {
        const onTabChange = vi.fn();
        renderWithProviders(<ChatList {...defaultProps} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText("Unread"));
        expect(onTabChange).toHaveBeenCalledWith("Unread");
    });

    it("calls onTabChange with 'Favourites' when the Favorites tab is clicked", () => {
        const onTabChange = vi.fn();
        renderWithProviders(<ChatList {...defaultProps} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText("Favorites"));
        expect(onTabChange).toHaveBeenCalledWith("Favourites");
    });

    it("calls onTabChange with 'Group' when the Groups tab is clicked", () => {
        const onTabChange = vi.fn();
        renderWithProviders(<ChatList {...defaultProps} onTabChange={onTabChange} />);
        fireEvent.click(screen.getByText("Groups"));
        expect(onTabChange).toHaveBeenCalledWith("Group");
    });

    it("calls onSearchChange when typing in the search input", () => {
        const onSearchChange = vi.fn();
        renderWithProviders(<ChatList {...defaultProps} onSearchChange={onSearchChange} />);
        const input = screen.getByPlaceholderText("Search chats...");
        fireEvent.change(input, { target: { value: "ali" } });
        expect(onSearchChange).toHaveBeenCalledWith("ali");
    });

    it("calls onNewChat when the 'New chat' button is clicked", () => {
        const onNewChat = vi.fn();
        const chat = mockChat();
        renderWithProviders(<ChatList {...defaultProps} chats={[chat]} onNewChat={onNewChat} />);
        fireEvent.click(screen.getByText("New chat"));
        expect(onNewChat).toHaveBeenCalledTimes(1);
    });
});

