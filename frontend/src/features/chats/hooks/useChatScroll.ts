// hooks/useChatScroll.ts
import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface ScrollState {
    hasUserScrolledUp: boolean;
    upwardScrollVersion: number;
}

export function useChatScroll(chatId: string, messageCount: number) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastScrollTopRef = useRef(0);
    const pendingAdjustmentRef = useRef<{
        pageCount: number;
        scrollHeight: number;
        scrollTop: number;
    } | null>(null);
    const initialScrollDoneRef = useRef<Set<string>>(new Set());

    const [scrollState, setScrollState] = useState<ScrollState>({
        hasUserScrolledUp: false,
        upwardScrollVersion: 0,
    });
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

    // Reset on chat change
    useLayoutEffect(() => {
        lastScrollTopRef.current = 0;
        pendingAdjustmentRef.current = null;
        setScrollState({ hasUserScrolledUp: false, upwardScrollVersion: 0 });
    }, [chatId]);

    // Initial scroll to bottom
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (
            !container ||
            !messageCount ||
            initialScrollDoneRef.current.has(chatId)
        ) {
            return;
        }
        container.scrollTop = container.scrollHeight;
        lastScrollTopRef.current = container.scrollTop;
        initialScrollDoneRef.current.add(chatId);
    }, [chatId, messageCount]);

    // Maintain scroll position after loading older messages
    useLayoutEffect(() => {
        const pending = pendingAdjustmentRef.current;
        const container = containerRef.current;
        if (!pending || !container) return;

        const heightDiff = container.scrollHeight - pending.scrollHeight;
        container.scrollTop = pending.scrollTop + heightDiff;
        lastScrollTopRef.current = container.scrollTop;
        pendingAdjustmentRef.current = null;
    }, [messageCount]);

    // Scroll to bottom on new own message
    useLayoutEffect(() => {
        if (!shouldScrollToBottom) return;
        const container = containerRef.current;
        if (container) {
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
        setShouldScrollToBottom(false);
    }, [shouldScrollToBottom]);

    const prepareLoadMore = useCallback((currentPageCount: number) => {
        const container = containerRef.current;
        if (!container) return;
        pendingAdjustmentRef.current = {
            pageCount: currentPageCount,
            scrollHeight: container.scrollHeight,
            scrollTop: container.scrollTop,
        };
    }, []);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        if (container.scrollTop < lastScrollTopRef.current) {
            setScrollState((prev) => ({
                hasUserScrolledUp: true,
                upwardScrollVersion: prev.upwardScrollVersion + 1,
            }));
        }
        lastScrollTopRef.current = container.scrollTop;
    }, []);

    const scrollToBottom = useCallback(() => setShouldScrollToBottom(true), []);

    return {
        containerRef,
        scrollState,
        handleScroll,
        prepareLoadMore,
        scrollToBottom,
    };
}
