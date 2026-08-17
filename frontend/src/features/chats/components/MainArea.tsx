import type { ChatItem } from "./ChatList";
import MainAreaEmptyChats from "./MainAreaEmptyChats";
import { RiArrowLeftLine, RiChat3Line } from "react-icons/ri";

interface ChatListProps {
    chats: ChatItem[];
    activeChatId?: string;
    selectedChat?: ChatItem;
    onChatClick?: (chat: ChatItem) => void;
    onBackToList?: () => void;
    onNewChat?: () => void;
}

export default function MainArea({
    chats,
    activeChatId,
    selectedChat,
    onChatClick,
    onBackToList,
    onNewChat,
}: ChatListProps) {
    // If no chats at all
    if (!chats || chats.length === 0) {
        return <MainAreaEmptyChats />;
    }

    // If there are chats but none selected
    if (!activeChatId) {
        return (
            <main className="flex-1 bg-background flex flex-col h-[calc(100vh-68.8px)] items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-brand-500/10 flex items-center justify-center">
                        <RiChat3Line className="w-12 h-12 text-brand-500" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center max-w-md relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                        Choose a{" "}
                        <span className="text-brand-500">conversation</span>
                    </h1>
                    <p className="text-text-secondary text-sm sm:text-base mb-2">
                        Select a chat from the sidebar to continue
                    </p>
                    <p className="text-text-muted text-sm mb-8">
                        Or start a new conversation with someone new
                    </p>

                    <button
                        onClick={onNewChat}
                        className="px-6 py-3 rounded-xl bg-brand-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20 mx-auto"
                    >
                        <RiChat3Line className="w-5 h-5" />
                        Start a new chat
                    </button>
                </div>
            </main>
        );
    }

    // Active chat selected - show the chat view
    return (
        <div className="flex-1 flex flex-col bg-background h-[calc(100vh-68.8px)]">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface/50">
                {/* Back button - visible only on mobile when chat is selected */}
                <button
                    onClick={onBackToList}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-elevated transition-colors text-text-secondary"
                    aria-label="Back to chat list"
                >
                    <RiArrowLeftLine className="w-5 h-5" />
                </button>

                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    {selectedChat?.avatar ? (
                        <img
                            src={selectedChat?.avatar}
                            alt={selectedChat?.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-brand-500 font-semibold">
                            {selectedChat?.name?.charAt(0) || "?"}
                        </span>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary truncate">
                        {selectedChat?.name || "Unknown"}
                        {selectedChat?.isGroup && (
                            <span className="text-xs text-text-muted ml-1">
                                ({selectedChat?.groupMemberCount || 0})
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-text-muted">
                        {selectedChat?.onlineStatus === "online" && "Online"}
                        {selectedChat?.onlineStatus === "away" && "Away"}
                        {selectedChat?.onlineStatus === "offline" && "Offline"}
                        {selectedChat?.isGroup &&
                            `${selectedChat?.groupMemberCount || 0} members`}
                    </p>
                </div>
            </div>

            {/* Chat messages area */}
            <div className="flex-1 flex items-center justify-center text-text-muted p-6">
                <div className="text-center">
                    <RiChat3Line className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Messages will appear here</p>
                    <p className="text-xs">
                        Start typing below to send a message
                    </p>
                </div>
            </div>

            {/* Chat input */}
            <div className="p-3 sm:p-4 border-t border-border bg-surface/50">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        placeholder={`Message ${selectedChat?.name || "..."}`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500 transition-colors"
                    />
                    <button className="px-4 sm:px-6 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors whitespace-nowrap">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
