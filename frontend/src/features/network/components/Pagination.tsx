import { useEffect, useRef } from "react";

interface PaginationProps {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
}

export const Pagination = ({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: PaginationProps) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onLoadMore();
            },
            { rootMargin: "160px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <div
            ref={sentinelRef}
            className="flex min-h-14 items-center justify-center mt-8 text-sm text-text-muted"
        >
            {isFetchingNextPage
                ? "Loading more users..."
                : !hasNextPage
                  ? "You've reached the end."
                  : null}
        </div>
    );
};
