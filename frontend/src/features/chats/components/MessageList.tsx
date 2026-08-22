import { memo, useMemo } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { isSameDay, type Message } from "../lib/helpers";
import { DateDivider } from "./DateDivider";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
    messages: Message[];
    currentUserId?: number;
    directChatName?: string;
    loadMore: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    hasUserScrolledUp: boolean;
    upwardScrollVersion: number;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

type DisplayItem =
    | { type: "date"; key: string; date: Date }
    | { type: "message"; key: string; message: Message };

export const MessageList = memo(function MessageList({
    messages,
    currentUserId,
    directChatName,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    hasUserScrolledUp,
    scrollContainerRef,
}: MessageListProps) {
    // Build display items: reverse order (oldest first) + inject date dividers
    const displayItems = useMemo<DisplayItem[]>(() => {
        const items: DisplayItem[] = [];
        let lastDate: Date | null = null;

        // messages is newest-first from API, iterate backwards to build oldest-first display
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const messageDate = message.createdAt;

            // Add date divider when day changes
            if (!lastDate || !isSameDay(messageDate, lastDate)) {
                const dateKey = `date-${messageDate.toISOString().split("T")[0]}`;
                items.push({
                    type: "date",
                    key: `${dateKey}-${message.id}`,
                    date: messageDate,
                });
                lastDate = messageDate;
            }

            items.push({ type: "message", key: message.id, message });
        }

        return items;
    }, [messages]);

    const sentinelRef = useInfiniteScroll(
        scrollContainerRef,
        hasNextPage,
        isFetchingNextPage,
        hasUserScrolledUp,
        loadMore,
    );

    return (
        <>
            <div ref={sentinelRef} aria-hidden="true" />
            {displayItems.map((item) =>
                item.type === "date" ? (
                    <DateDivider key={item.key} date={item.date} />
                ) : (
                    <MessageBubble
                        key={item.key}
                        message={item.message}
                        currentUserId={currentUserId}
                        directChatName={directChatName}
                    />
                ),
            )}
        </>
    );
});
