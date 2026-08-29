import { useCallback } from "react";
import { RiChat3Line } from "react-icons/ri";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { useChatMessages, useSendMessage } from "../hooks/useChatMessages";
import { useChatScroll } from "../hooks/useChatScroll";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import { isMessageSentByCurrentUser, type Message } from "../lib/helpers";

interface MainAreaActiveChatProps {
    activeChatId: string;
    selectedChat: ChatItem;
    onBackToList?: () => void;
}

// Helper to extract messages with proper union type
function extractMessages(
    data: { pages: ChatMessagesResponse[] } | undefined,
): Message[] {
    if (!data) return [];
    return data.pages.flatMap((page) => page.messages as Message[]);
}

export function MainAreaActiveChat({
    activeChatId,
    selectedChat,
    onBackToList,
}: MainAreaActiveChatProps) {
    const { data: currentUser } = useCurrentUser();
    const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useChatMessages(activeChatId);

    const messages = extractMessages(data);
    const messageCount = messages.length;
    const latestMessage = messages[0];
    const suggestions = latestMessage
        ? isMessageSentByCurrentUser(latestMessage, currentUser?.id)
            ? []
            : (latestMessage.suggestions?.suggestions ??
              (latestMessage.id === selectedChat.lastMessage.id
                  ? (selectedChat.lastMessage.suggestions?.suggestions ?? [])
                  : []))
        : selectedChat.lastMessage.sender.id !== currentUser?.id
          ? (selectedChat.lastMessage.suggestions?.suggestions ?? [])
          : [];

    const {
        containerRef,
        scrollState,
        handleScroll,
        prepareLoadMore,
        scrollToBottom,
    } = useChatScroll(activeChatId, messageCount);

    const sendMessage = useSendMessage(activeChatId, selectedChat.type);

    const handleSend = useCallback(
        (content: string) => {
            if (!currentUser) return;
            sendMessage(content, currentUser, selectedChat);
            scrollToBottom();
        },
        [currentUser, sendMessage, scrollToBottom],
    );

    const handleLoadMore = useCallback(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        prepareLoadMore(data?.pages.length ?? 0);
        void fetchNextPage();
    }, [
        hasNextPage,
        isFetchingNextPage,
        data?.pages.length,
        fetchNextPage,
        prepareLoadMore,
    ]);

    if (!currentUser) return null;

    return (
        <div className="flex-1 flex flex-col bg-background h-[calc(100vh-68.8px)]">
            <ChatHeader
                name={selectedChat.name}
                photo={selectedChat.photo}
                type={selectedChat.type}
                onBack={onBackToList}
            />

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1"
            >
                {isPending ? (
                    <MessageSkeleton />
                ) : messages.length === 0 ? (
                    <EmptyState chatName={selectedChat.name} />
                ) : (
                    <MessageList
                        messages={messages}
                        currentUserId={currentUser.id}
                        directChatName={selectedChat.name}
                        loadMore={handleLoadMore}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        hasUserScrolledUp={scrollState.hasUserScrolledUp}
                        upwardScrollVersion={scrollState.upwardScrollVersion}
                        scrollContainerRef={containerRef}
                    />
                )}
            </div>

            <MessageInput
                chatName={selectedChat.name}
                onSend={handleSend}
                disabled={isPending}
                suggestions={suggestions}
            />
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────

function MessageSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`h-12 rounded-2xl w-2/3 ${
                            i % 2 === 0
                                ? "bg-brand-500/20 rounded-br-md"
                                : "bg-surface-elevated rounded-bl-md"
                        }`}
                    />
                </div>
            ))}
        </div>
    );
}

function EmptyState({ chatName }: { chatName: string }) {
    return (
        <div className="flex items-center justify-center h-full text-text-muted">
            <div className="text-center">
                <RiChat3Line className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">
                    Start typing below to send a message to {chatName}
                </p>
            </div>
        </div>
    );
}
