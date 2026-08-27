import { useQuery } from "@tanstack/react-query";
import {
    RiCompass3Line,
    RiErrorWarningLine,
    RiInboxLine,
} from "react-icons/ri";
import {
    getConnections,
    getReceivedRequests,
    getSentRequests,
} from "../api/friends.api";
import { FriendCard } from "../components/FriendCard";
import { FriendsHeader } from "../components/FriendsHeader";
import {
    FriendsMobileTabs,
    FriendsSidebar,
    type FriendsTab,
} from "../components/FriendsSidebar";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function FriendsPage() {
    const [selectedTab, setSelectedTab] = useState<FriendsTab>("connections");
    const navigate = useNavigate();
    const connectionsQuery = useQuery({
        queryKey: ["connections"],
        queryFn: getConnections,
    });
    const sentQuery = useQuery({
        queryKey: ["sent-requests"],
        queryFn: getSentRequests,
    });
    const receivedQuery = useQuery({
        queryKey: ["received-requests"],
        queryFn: getReceivedRequests,
    });

    const activeQuery =
        selectedTab === "connections"
            ? connectionsQuery
            : selectedTab === "sent"
              ? sentQuery
              : receivedQuery;
    const receivedCount =
        receivedQuery.data?.filter((request) => request.status === "PENDING")
            .length ?? 0;
    const sentCount = sentQuery.data?.length ?? 0;
    const isEmpty =
        selectedTab === "connections"
            ? (connectionsQuery.data?.length ?? 0) === 0
            : selectedTab === "sent"
              ? sentCount === 0
              : receivedCount === 0;

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <div className="flex flex-col lg:flex-row">
                <aside className="hidden w-80 shrink-0 border-r border-border bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:block xl:w-96">
                    <FriendsSidebar
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        receivedCount={receivedCount}
                    />
                </aside>
                <FriendsMobileTabs
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    receivedCount={receivedCount}
                />
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-80 lg:px-10 xl:ml-96">
                    <FriendsHeader tab={selectedTab} />
                    <div className="space-y-2">
                        {activeQuery.isPending ? (
                            <p className="py-12 text-center text-sm text-text-muted">
                                Loading{" "}
                                {selectedTab === "connections"
                                    ? "connections"
                                    : "requests"}
                                ...
                            </p>
                        ) : activeQuery.isError ? (
                            <div className="py-12 text-center">
                                <RiErrorWarningLine className="mx-auto mb-3 h-7 w-7 text-error" />
                                <p className="text-sm text-error">
                                    Unable to load this section. Please try
                                    again.
                                </p>
                            </div>
                        ) : isEmpty ? (
                            <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
                                <RiInboxLine className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                                <h2 className="text-base font-semibold text-text-primary">
                                    {selectedTab === "connections"
                                        ? "No connections yet"
                                        : selectedTab === "sent"
                                          ? "No sent requests"
                                          : "No received requests"}
                                </h2>
                                <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
                                    {selectedTab === "connections"
                                        ? "Discover language learners and start building your community."
                                        : "This is where your connection requests will appear."}
                                </p>
                                {selectedTab === "connections" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/network", {
                                                viewTransition: true,
                                            })
                                        }
                                        className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
                                    >
                                        <RiCompass3Line className="h-4 w-4" />
                                        Discover people
                                    </button>
                                )}
                            </div>
                        ) : selectedTab === "connections" ? (
                            connectionsQuery.data?.map((connection) => (
                                <FriendCard
                                    key={connection.friend.id}
                                    tab="connections"
                                    item={connection}
                                />
                            ))
                        ) : selectedTab === "sent" ? (
                            sentQuery.data?.map((request) => (
                                <FriendCard
                                    key={request.id}
                                    tab="sent"
                                    item={request}
                                />
                            ))
                        ) : (
                            receivedQuery.data
                                ?.filter(
                                    (request) => request.status === "PENDING",
                                )
                                .map((request) => (
                                    <FriendCard
                                        key={request.id}
                                        tab="received"
                                        item={request}
                                    />
                                ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
