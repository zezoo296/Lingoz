import {
    RiAddLine,
    RiCheckLine,
    RiCheckDoubleLine,
    RiTeamLine,
} from "react-icons/ri";
import EmptyChats from "./EmptyChats";
import SearchChats from "./SearchChats";
import TabsChats from "./TabsChats";

export type OnlineStatus = "online" | "away" | "offline";

export interface ChatItem {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isUnread: boolean;
    onlineStatus: OnlineStatus;
    isGroup?: boolean;
    groupMemberCount?: number;
    senderName?: string; // for groups: who sent the last message
    isOwnMessage?: boolean; // true if you sent the last message
    isRead?: boolean; // true if your last message was read by them
}

interface ChatListProps {
    chats: ChatItem[];
    activeChatId?: string;
    onChatClick?: (chat: ChatItem) => void;
    onNewChat?: () => void;
}

const statusColor: Record<OnlineStatus, string> = {
    online: "bg-success",
    away: "bg-warning",
    offline: "bg-text-disabled",
};

const statusLabel: Record<OnlineStatus, string> = {
    online: "Online",
    away: "Away",
    offline: "Offline",
};

export default function ChatList({
    chats,
    activeChatId,
    onChatClick,
}: ChatListProps) {
    return (
        <>
            {/* Search */}
            <SearchChats />
            {/* Tabs */}
            <TabsChats />

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto my-2 max-h-[57vh] lg:max-h-[60vh]">
                {chats.length === 0 ? (
                    <EmptyChats />
                ) : (
                    chats.map((chat) => {
                        const isActive = chat.id === activeChatId;
                        const hasUnread = chat.unreadCount > 0;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => onChatClick?.(chat)}
                                className={[
                                    "flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-2",
                                    isActive
                                        ? "bg-surface-elevated/70 border-brand-500"
                                        : "hover:bg-surface-elevated border-transparent",
                                    hasUnread && !isActive
                                        ? "bg-surface-elevated/30"
                                        : "",
                                ].join(" ")}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    {chat.isGroup ? (
                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-500 to-brand-800 flex items-center justify-center">
                                            <RiTeamLine className="w-5 h-5 text-white" />
                                        </div>
                                    ) : (
                                        <img
                                            src={chat.avatar}
                                            alt={chat.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <span
                                        className={[
                                            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface",
                                            statusColor[chat.onlineStatus],
                                        ].join(" ")}
                                    />
                                </div>

                                {/* Content */}
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
                                            {chat.timestamp}
                                        </span>
                                    </div>

                                    {/* Last Message */}
                                    <p
                                        className={[
                                            "text-sm truncate",
                                            hasUnread
                                                ? "text-text-primary font-medium"
                                                : "text-text-muted",
                                        ].join(" ")}
                                    >
                                        {chat.isGroup && chat.senderName && (
                                            <span className="text-text-secondary">
                                                {chat.senderName}:{" "}
                                            </span>
                                        )}
                                        {chat.isOwnMessage && "You: "}
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                {/* Right Side */}
                                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                                    {hasUnread ? (
                                        <span className="w-5 h-5 bg-brand-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                            {chat.unreadCount > 9
                                                ? "9+"
                                                : chat.unreadCount}
                                        </span>
                                    ) : chat.isOwnMessage ? (
                                        chat.isRead ? (
                                            <RiCheckDoubleLine className="w-4 h-4 text-brand-500" />
                                        ) : (
                                            <RiCheckLine className="w-4 h-4 text-text-muted" />
                                        )
                                    ) : null}

                                    <span
                                        className={[
                                            "text-[10px] font-medium",
                                            chat.onlineStatus === "online"
                                                ? "text-success"
                                                : chat.onlineStatus === "away"
                                                  ? "text-warning"
                                                  : "text-text-muted",
                                        ].join(" ")}
                                    >
                                        {statusLabel[chat.onlineStatus]}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-t border-border">
                <button className="w-full py-3 rounded-xl bg-brand-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
                    <RiAddLine className="w-5 h-5" />
                    New chat
                </button>
            </div>
        </>
    );
}
