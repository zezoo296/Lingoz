import { RiCloseLine, RiMessage3Line } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ChatItem } from "@linguachat/shared";
import { getConnections } from "../../friends/api/friends.api";
import { getOrCreateDirectChat } from "../api/chatApi";

export default function NewChatModal({
    onClose,
    onChatCreated,
}: {
    onClose: () => void;
    onChatCreated: (chat: ChatItem) => void;
}) {
    const queryClient = useQueryClient();
    const connectionsQuery = useQuery({
        queryKey: ["connections"],
        queryFn: getConnections,
    });
    const createChatMutation = useMutation({
        mutationFn: getOrCreateDirectChat,
        onSuccess: (chat) => {
            queryClient.setQueryData<ChatItem[]>(["chats"], (current = []) =>
                current.some((item) => item.id === chat.id)
                    ? current
                    : [chat, ...current],
            );
            onChatCreated(chat);
            onClose();
        },
        onError: (error: Error) => toast.error(error.message),
    });

    return (
        <div className="fixed inset-0 z-60 flex items-start justify-center bg-background/80 p-4 pt-24 backdrop-blur-sm">
            <div className="flex max-h-[75vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                        <h2 className="font-semibold text-text-primary">Start a new chat</h2>
                        <p className="mt-0.5 text-xs text-text-muted">Choose one of your connections</p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-lg p-2 text-text-muted hover:bg-surface-hover hover:text-text-primary" aria-label="Close new chat dialog">
                        <RiCloseLine className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto p-2">
                    {connectionsQuery.isPending ? (
                        <p className="px-3 py-8 text-center text-sm text-text-muted">Loading connections...</p>
                    ) : connectionsQuery.isError ? (
                        <p className="px-3 py-8 text-center text-sm text-error">Unable to load connections.</p>
                    ) : connectionsQuery.data.length === 0 ? (
                        <p className="px-3 py-8 text-center text-sm text-text-muted">Connect with someone first to start chatting.</p>
                    ) : connectionsQuery.data.map(({ friend }) => (
                        <div key={friend.id} className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-elevated">
                            {friend.photo ? <img src={friend.photo} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 font-semibold text-brand-500">{(friend.name ?? "?").charAt(0).toUpperCase()}</div>}
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{friend.name ?? "Unnamed user"}</span>
                            <button type="button" disabled={createChatMutation.isPending} onClick={() => createChatMutation.mutate(friend.id)} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-60">
                                <RiMessage3Line className="h-4 w-4" /> Message
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
