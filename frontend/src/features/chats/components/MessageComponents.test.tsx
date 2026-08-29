import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "./MessageInput.tsx";
import { MessageList } from "./MessageList.tsx";
import { MessageBubble } from "./MessageBubble.tsx";
import type { Message } from "../lib/helpers.ts";
import type { DirectMessage } from "@linguachat/shared";

// Mock api calls/dependencies for Translate message
vi.mock("../api/chatApi.ts", () => ({
    translateMessage: vi.fn(),
}));

describe("Chat Core Components", () => {
    describe("MessageInput", () => {
        it("renders suggestions and clicking updates input value", async () => {
            const user = userEvent.setup();
            const suggestions = ["Yes", "No", "Maybe"];
            render(
                <MessageInput
                    chatName="Alice"
                    onSend={vi.fn()}
                    suggestions={suggestions}
                />,
            );

            const chips = screen.getAllByRole("button");
            // 3 suggestion buttons + 1 Send button = 4 buttons total
            expect(chips).toHaveLength(4);
            expect(screen.getByText("Yes")).toBeInTheDocument();

            const input = screen.getByPlaceholderText("Message Alice");
            expect(input).toHaveValue("");

            await user.click(screen.getByText("Yes"));
            expect(input).toHaveValue("Yes");
        });

        it("calls onSend on submit and clears input", async () => {
            const user = userEvent.setup();
            const onSendMock = vi.fn();
            render(<MessageInput chatName="Alice" onSend={onSendMock} />);

            const input = screen.getByPlaceholderText("Message Alice");
            await user.type(input, "Hello Alice");

            const sendBtn = screen.getByRole("button", { name: /send/i });
            await user.click(sendBtn);

            expect(onSendMock).toHaveBeenCalledWith("Hello Alice");
            expect(input).toHaveValue("");
        });
    });

    describe("MessageList", () => {
        it("renders date dividers and displays messages in chronological order", () => {
            const date1 = new Date("2026-05-10T10:00:00Z");
            const date2 = new Date("2026-05-11T12:00:00Z");

            const messages: Message[] = [
                // messages from API are newest first
                {
                    id: "msg-2",
                    client_id: null,
                    chatId: "chat-1",
                    content: "newest message",
                    createdAt: date2,
                    senderId: 2,
                    recieverId: 1,
                    status: "Delivered",
                    suggestions: null,
                } as DirectMessage,
                {
                    id: "msg-1",
                    client_id: null,
                    chatId: "chat-1",
                    content: "oldest message",
                    createdAt: date1,
                    senderId: 1,
                    recieverId: 2,
                    status: "Read",
                    suggestions: null,
                } as DirectMessage,
            ];

            const scrollContainerRef = React.createRef<HTMLDivElement>();

            render(
                <MessageList
                    messages={messages}
                    currentUserId={1}
                    directChatName="Alice"
                    loadMore={vi.fn()}
                    hasNextPage={false}
                    isFetchingNextPage={false}
                    hasUserScrolledUp={false}
                    upwardScrollVersion={1}
                    scrollContainerRef={scrollContainerRef}
                />,
            );

            // Verify oldest message rendered before newest message (chronological)
            const bubbleElements = screen.getAllByText(/message$/);
            expect(bubbleElements[0]).toHaveTextContent("oldest message");
            expect(bubbleElements[1]).toHaveTextContent("newest message");

            // Verify date divider headers rendered (e.g. date formatted strings)
            expect(screen.getByText(/Sunday, May 10, 2026/i)).toBeInTheDocument();
            expect(screen.getByText(/Monday, May 11, 2026/i)).toBeInTheDocument();
        });
    });

    describe("MessageBubble", () => {
        it("renders sender photo, translation icon and status icon", () => {
            const message: Message = {
                id: "msg-1",
                client_id: null,
                chatId: "chat-1",
                content: "Bubble message",
                createdAt: new Date(),
                senderId: 1, // Sent by me
                recieverId: 2,
                status: "Read",
                suggestions: null,
            } as DirectMessage;

            render(
                <MessageBubble
                    message={message}
                    currentUserId={1}
                    directChatName="Alice"
                />,
            );

            expect(screen.getByText("Bubble message")).toBeInTheDocument();
            // Translate button should be present
            expect(screen.getByRole("button", { name: /translate/i })).toBeInTheDocument();
        });
    });
});
