import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/mocks/server";
import NewChatModal from "./NewChatModal";
import type { ChatItem } from "@linguachat/shared";
import type { Connection } from "../../friends/api/friends.api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createWrapper(queryClient: QueryClient) {
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

function makeQueryClient() {
    return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
}

const mockConnections: Connection[] = [
    {
        createdAt: new Date().toISOString(),
        friend: {
            id: 42,
            name: "Charlie",
            username: "charlie42",
            photo: null,
            lastSeen: null,
            countryCode: null,
            city: null,
            userLanguages: [],
        },
    },
];

const mockChatItem: ChatItem = {
    id: "chat-99",
    type: "Direct",
    name: "Charlie",
    photo: "",
    isFavourite: false,
    unreadCount: 0,
    lastMessage: {
        id: "msg-1",
        content: "Hi",
        created_at: new Date().toISOString(),
        sender: { id: 42, name: "Charlie" },
        statuses: [],
        suggestions: null,
    },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("NewChatModal", () => {
    it("shows a loading indicator while connections are loading", () => {
        // Never resolve the request so it stays pending
        server.use(
            http.get("*/friendships/connections", async () => {
                await new Promise(() => {});
            }),
        );

        const queryClient = makeQueryClient();
        render(<NewChatModal onClose={vi.fn()} onChatCreated={vi.fn()} />, {
            wrapper: createWrapper(queryClient),
        });

        expect(screen.getByText("Loading connections...")).toBeInTheDocument();
    });

    it("shows an error message when connections query fails", async () => {
        server.use(
            http.get("*/friendships/connections", () =>
                HttpResponse.json({ message: "Server error" }, { status: 500 }),
            ),
        );

        const queryClient = makeQueryClient();
        render(<NewChatModal onClose={vi.fn()} onChatCreated={vi.fn()} />, {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
            expect(screen.getByText("Unable to load connections.")).toBeInTheDocument();
        });
    });

    it("shows empty state when the connections list is empty", async () => {
        server.use(
            http.get("*/friendships/connections", () =>
                HttpResponse.json({ data: [] }),
            ),
        );

        const queryClient = makeQueryClient();
        render(<NewChatModal onClose={vi.fn()} onChatCreated={vi.fn()} />, {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
            expect(
                screen.getByText("Connect with someone first to start chatting."),
            ).toBeInTheDocument();
        });
    });

    it("renders connection names when the query succeeds", async () => {
        server.use(
            http.get("*/friendships/connections", () =>
                HttpResponse.json({ data: mockConnections }),
            ),
        );

        const queryClient = makeQueryClient();
        render(<NewChatModal onClose={vi.fn()} onChatCreated={vi.fn()} />, {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
            expect(screen.getByText("Charlie")).toBeInTheDocument();
        });
    });

    it("calls onChatCreated and onClose when the Message button is clicked and mutation succeeds", async () => {
        server.use(
            http.get("*/friendships/connections", () =>
                HttpResponse.json({ data: mockConnections }),
            ),
            http.post("*/chats/direct/:id", () =>
                HttpResponse.json({ data: mockChatItem }),
            ),
        );

        const onChatCreated = vi.fn();
        const onClose = vi.fn();
        const queryClient = makeQueryClient();

        render(<NewChatModal onClose={onClose} onChatCreated={onChatCreated} />, {
            wrapper: createWrapper(queryClient),
        });

        await waitFor(() => screen.getByText("Charlie"));

        await userEvent.click(screen.getByRole("button", { name: /message/i }));

        await waitFor(() => {
            expect(onChatCreated).toHaveBeenCalledWith(mockChatItem);
            expect(onClose).toHaveBeenCalled();
        });
    });

    it("calls onClose when the close button is clicked", async () => {
        server.use(
            http.get("*/friendships/connections", () =>
                HttpResponse.json({ data: [] }),
            ),
        );

        const onClose = vi.fn();
        const queryClient = makeQueryClient();

        render(<NewChatModal onClose={onClose} onChatCreated={vi.fn()} />, {
            wrapper: createWrapper(queryClient),
        });

        await userEvent.click(screen.getByRole("button", { name: /close new chat dialog/i }));
        expect(onClose).toHaveBeenCalled();
    });
});
