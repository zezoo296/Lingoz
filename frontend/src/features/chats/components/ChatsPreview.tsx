import type { ChatItem } from "@linguachat/shared";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { RiCheckLine, RiCheckDoubleLine } from "react-icons/ri";
import {
    formatMessageTime,
    getLastMessageDeliveryStatus,
} from "../lib/helpers";

interface ChatsPreview {
    chats: ChatItem[];
    activeChatId?: string;
    onChatClick?: (chat: ChatItem) => void;
}

function LastMessageStatus({
    chat,
    currentUserId,
}: {
    chat: ChatItem;
    currentUserId?: number;
}) {
    if (chat.lastMessage.sender.id !== currentUserId) return null;

    const status = getLastMessageDeliveryStatus(chat);

    if (status === "Read") {
        return (
            <RiCheckDoubleLine className="w-3.5 h-3.5 text-blue-300 shrink-0" />
        );
    }
    if (status === "Delivered") {
        return (
            <RiCheckDoubleLine className="w-3.5 h-3.5 text-text-muted shrink-0" />
        );
    }
    return <RiCheckLine className="w-3.5 h-3.5 text-text-muted shrink-0" />;
}

export default function ChatsPreview({
    chats,
    activeChatId,
    onChatClick,
}: ChatsPreview) {
    const { data: currentUser } = useCurrentUser();
    const currentUserId = currentUser?.id;
    return chats.map((chat) => {
        const isActive = chat.id === activeChatId;
        const hasUnread =
            chat.unreadCount > 0 &&
            chat.lastMessage.sender.id !== currentUserId;

        return (
            <div
                key={chat.id}
                onClick={() => onChatClick?.(chat)}
                className={[
                    "flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-2",
                    isActive
                        ? "bg-surface-elevated/70 border-brand-500"
                        : hasUnread
                          ? "bg-surface-elevated/60 hover:bg-surface-elevated border-transparent"
                          : "hover:bg-surface-elevated border-transparent",
                ].join(" ")}
            >
                {chat.photo ? (
                    <img
                        src={chat.photo}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 font-semibold flex items-center justify-center shrink-0">
                        {chat.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                        <span
                            className={[
                                "text-sm truncate",
                                hasUnread
                                    ? "font-semibold text-text-primary"
                                    : "font-medium text-text-secondary",
                            ].join(" ")}
                        >
                            {chat.name}
                        </span>
                        <span
                            className={[
                                "text-xs shrink-0 ml-2",
                                hasUnread
                                    ? "text-brand-500 font-medium"
                                    : "text-text-muted",
                            ].join(" ")}
                        >
                            {formatMessageTime(chat.lastMessage.created_at)}
                        </span>
                    </div>

                    <div
                        className={[
                            "flex items-center gap-1 text-sm min-w-0",
                            hasUnread
                                ? "text-text-primary font-medium"
                                : "text-text-muted",
                        ].join(" ")}
                    >
                        <LastMessageStatus
                            chat={chat}
                            currentUserId={currentUserId}
                        />
                        {chat.type === "Group" && (
                            <span className="text-text-secondary shrink-0">
                                {chat.lastMessage.sender.name}:{" "}
                            </span>
                        )}
                        <span className="truncate">
                            {chat.lastMessage.content}
                        </span>
                    </div>
                </div>

                {hasUnread && (
                    <span className="w-5 h-5 bg-brand-500 rounded-full text-xs flex items-center justify-center text-white font-bold shrink-0 ml-2">
                        {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </span>
                )}
            </div>
        );
    });
}
