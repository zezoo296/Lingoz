import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import type { DiscoveryUsersResponse, UserQueryParams } from "@linguachat/shared";
import { RiEqualizerLine, RiCloseLine } from "react-icons/ri";
import { NetworkSidebar } from "../components/NetworkSidebar";
import { NetworkHeader } from "../components/NetworkHeader";
import { UserCard } from "../components/UserCard";
import { Pagination } from "../components/Pagination";
import NetworkSearch from "../components/NetworkSearch";
import { getUsers } from "../api/users.api";

export default function NetworkPage() {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filterDraft, setFilterDraft] = useState<UserQueryParams>({
        status: "all",
    });
    const [appliedFilters, setAppliedFilters] = useState<UserQueryParams>({
        status: "all",
    });
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const queryParams = useMemo<UserQueryParams>(
        () => ({
            ...appliedFilters,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
        }),
        [appliedFilters, debouncedSearch],
    );
    const {
        data,
        isPending,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        DiscoveryUsersResponse,
        Error,
        InfiniteData<DiscoveryUsersResponse>,
        readonly [string, UserQueryParams],
        string | null
    >({
        queryKey: ["network-users", queryParams],
        queryFn: ({ pageParam }) => getUsers(queryParams, 10, pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

    const users = data?.pages.flatMap((page) => page.users) ?? [];

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleResetFilters = useCallback(() => {
        const clearedFilters: UserQueryParams = { status: "all" };
        setFilterDraft(clearedFilters);
        setAppliedFilters(clearedFilters);
    }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <div className="flex flex-col lg:flex-row">
                {/* Mobile Filter Toggle */}
                <div className="p-4 lg:hidden">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                        {showMobileFilters ? (
                            <RiCloseLine className="w-5 h-5" />
                        ) : (
                            <RiEqualizerLine className="w-5 h-5" />
                        )}
                        {showMobileFilters ? "Close filters" : "Filters"}
                    </button>
                </div>

                <aside
                    className={`${
                        showMobileFilters ? "block" : "hidden"
                    } w-full bg-surface border-b border-border lg:block lg:fixed lg:top-0 lg:left-0 lg:h-full lg:pt-3 lg:w-80 xl:w-96 lg:border-r lg:border-b-0 lg:overflow-y-auto z-30`}
                >
                    <NetworkSidebar
                        filters={filterDraft}
                        onFiltersChange={setFilterDraft}
                        onApply={() => setAppliedFilters(filterDraft)}
                        onReset={handleResetFilters}
                    />
                </aside>

                {/* Main Content — offset by sidebar width on desktop */}
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:ml-80 xl:ml-96">
                    <NetworkHeader />

                    <NetworkSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        onDebouncedSearchChange={setDebouncedSearch}
                    />

                    {/* Users List */}
                    <div className="space-y-2">
                        {isPending ? (
                            <p className="py-8 text-center text-sm text-text-muted">
                                Loading users...
                            </p>
                        ) : isError ? (
                            <p className="py-8 text-center text-sm text-error">
                                {error.message}
                            </p>
                        ) : users.length === 0 ? (
                            <p className="py-8 text-center text-sm text-text-muted">
                                No users found.
                            </p>
                        ) : (
                            users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))
                        )}
                    </div>

                    {!isPending && !isError && users.length > 0 && (
                        <Pagination
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={handleLoadMore}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
