import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiMessageCircle, FiX } from "react-icons/fi";
import { RiMapPinLine, RiTimeLine, RiUserUnfollowLine } from "react-icons/ri";
import toast from "react-hot-toast";
import {
    getCountryNameFromCode,
    getLanguageNameFromCode,
} from "../../../lib/nameCode";
import type {
    Connection,
    FriendRequest,
    FriendRequestUser,
} from "../api/friends.api";
import { cancelRequest, respondToRequest, unfriend } from "../api/friends.api";
import type { FriendsTab } from "./FriendsSidebar";
import { useNavigate } from "react-router";

type FriendCardProps =
    | { tab: "connections"; item: Connection }
    | { tab: "sent" | "received"; item: FriendRequest };

const initials = (name: string | null) =>
    (name || "?")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

const formatLastActive = (lastSeen: string | null) => {
    if (!lastSeen) return "Activity unavailable";

    const diffMs = Math.max(0, Date.now() - new Date(lastSeen).getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Active just now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return `Active ${new Date(lastSeen).toLocaleDateString()}`;
};

function LanguageDetails({
    speakingLanguages,
    learningLanguages,
}: {
    speakingLanguages: Array<{ languageCode: string }>;
    learningLanguages: Array<{ languageCode: string }>;
}) {
    return (
        <div className="mt-2 space-y-1 text-xs text-text-secondary">
            <p>
                <span className="text-text-muted">Speaks: </span>
                {speakingLanguages.length > 0
                    ? speakingLanguages
                          .map((language) =>
                              getLanguageNameFromCode(language.languageCode as any),
                          )
                          .join(", ")
                    : "No languages listed"}
            </p>
            <p>
                <span className="text-text-muted">Learning: </span>
                {learningLanguages.length > 0
                    ? learningLanguages
                          .map((language) =>
                              getLanguageNameFromCode(language.languageCode as any),
                          )
                          .join(", ")
                    : "None listed"}
            </p>
        </div>
    );
}

const invalidateFriendData = (queryClient: ReturnType<typeof useQueryClient>) =>
    Promise.all([
        queryClient.invalidateQueries({ queryKey: ["connections"] }),
        queryClient.invalidateQueries({ queryKey: ["sent-requests"] }),
        queryClient.invalidateQueries({ queryKey: ["received-requests"] }),
    ]);

function RequestActions({
    tab,
    request,
}: {
    tab: Exclude<FriendsTab, "connections">;
    request: FriendRequest;
}) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (action: "approve" | "reject" | "cancel") => {
            if (action === "cancel") return cancelRequest(request.id);
            return respondToRequest(
                { status: action === "approve" ? "APPROVED" : "REJECTED" },
                request.id,
            );
        },
        onSuccess: (_, action) => {
            if (action === "approve") {
                toast.success("Friend request accepted.");
            } else if (action === "reject") {
                toast.success("Friend request rejected.");
            }

            void invalidateFriendData(queryClient);
        },
        onError: (error: Error) => toast.error(error.message),
    });

    if (tab === "sent") {
        if (request.status !== "PENDING") {
            return (
                <span
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        request.status === "APPROVED"
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                    }`}
                >
                    {request.status === "APPROVED" ? "Accepted" : "Rejected"}
                </span>
            );
        }

        return (
            <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate("cancel")}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-error/50 hover:bg-error/10 hover:text-error disabled:opacity-60"
            >
                {mutation.isPending ? "Cancelling..." : "Cancel request"}
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate("reject")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-error/50 hover:bg-error/10 hover:text-error disabled:opacity-60"
                aria-label="Decline request"
            >
                <FiX className="h-4 w-4" />
            </button>
            <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate("approve")}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
            >
                <FiCheck className="h-4 w-4" />
                {mutation.isPending ? "Saving..." : "Accept"}
            </button>
        </div>
    );
}

function ConnectionActions({ userId }: { userId: number }) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => unfriend(userId),
        onSuccess: () => void invalidateFriendData(queryClient),
        onError: (error: Error) => toast.error(error.message),
    });
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
                onClick={() => navigate("/chats", { viewTransition: true })}
            >
                <FiMessageCircle className="h-4 w-4" />
                Message
            </button>
            <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-error/50 hover:bg-error/10 hover:text-error disabled:opacity-60"
                aria-label="Remove connection"
            >
                <RiUserUnfollowLine className="h-4 w-4" />
            </button>
        </div>
    );
}

export function FriendCard({ tab, item }: FriendCardProps) {
    const connection = tab === "connections" ? item : null;
    const request = tab === "connections" ? null : item;
    const user: FriendRequestUser | Connection["friend"] = connection
        ? connection.friend
        : tab === "sent"
          ? request!.receiver!
          : request!.sender!;
    const location =
        [user.countryCode, user.city]
            .filter(Boolean)
            .map((value, index) =>
                index === 0 && user.countryCode
                    ? getCountryNameFromCode(user.countryCode as any)
                    : value,
            )
            .join(", ") || "Unknown location";
    const speakingLanguages = user.userLanguages.filter(
        (language) => language.isSpeaking,
    );
    const learningLanguages = user.userLanguages.filter(
        (language) => language.isLearning,
    );
    const requestedAt =
        request &&
        new Date(request.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });

    return (
        <article className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-hover sm:flex-row sm:items-center sm:justify-between fadeDown">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {user.photo ? (
                    <img
                        src={user.photo}
                        alt={user.name ?? "User"}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-800 text-xl font-bold text-white">
                        {initials(user.name)}
                    </div>
                )}
                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-text-primary">
                        {user.username ?? user.name ?? "Unnamed user"}
                    </h2>
                    {connection ? (
                        <>
                            <p className="truncate text-sm text-text-muted">
                                {user.name ?? "Language partner"}
                            </p>
                            <LanguageDetails
                                speakingLanguages={speakingLanguages}
                                learningLanguages={learningLanguages}
                            />
                        </>
                    ) : (
                        <>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                            <RiTimeLine className="h-4 w-4" />
                            {tab === "sent" ? "Sent" : "Received"} {requestedAt}
                            {request?.status === "REJECTED"
                                ? " · Rejected"
                                : ""}
                            </p>
                        <LanguageDetails
                            speakingLanguages={speakingLanguages}
                            learningLanguages={learningLanguages}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary sm:border-l sm:border-border sm:pl-4">
                <span className="flex items-center gap-1">
                    <RiMapPinLine className="h-4 w-4" />
                    {location}
                </span>
                {connection && <span>{formatLastActive(user.lastSeen)}</span>}
            </div>
            <div className="shrink-0 self-end sm:self-auto">
                {connection ? (
                    <ConnectionActions userId={connection.friend.id} />
                ) : (
                    <RequestActions
                        tab={tab as "sent" | "received"}
                        request={request!}
                    />
                )}
            </div>
        </article>
    );
}
