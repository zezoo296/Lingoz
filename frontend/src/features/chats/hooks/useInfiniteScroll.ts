// hooks/useInfiniteScroll.ts
import { useEffect, useRef } from "react";

export function useInfiniteScroll(
    containerRef: React.RefObject<HTMLDivElement | null>,
    hasNextPage: boolean,
    isFetching: boolean,
    isEnabled: boolean,
    onLoadMore: () => void,
) {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const lastTriggerRef = useRef<number>(0);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const container = containerRef.current;

        if (
            !sentinel ||
            !container ||
            !hasNextPage ||
            isFetching ||
            !isEnabled
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const now = Date.now();
                    // Debounce: prevent double triggers within 300ms
                    if (now - lastTriggerRef.current > 300) {
                        lastTriggerRef.current = now;
                        onLoadMore();
                    }
                }
            },
            { root: container, threshold: 0 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [containerRef, hasNextPage, isFetching, isEnabled, onLoadMore]);

    return sentinelRef;
}
