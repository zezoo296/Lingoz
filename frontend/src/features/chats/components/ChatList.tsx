import { RiAddLine } from "react-icons/ri";
import type { ChatItem } from "@linguachat/shared";
import EmptyChats from "./EmptyChats";
import SearchChats from "./SearchChats";
import TabsChats from "./TabsChats";
import ChatsPreview from "./ChatsPreview";
import type { Tabs } from "../lib/helpers";

interface ChatListProps {
    chats: ChatItem[];
    activeChatId?: string;
    onChatClick?: (chat: ChatItem) => void;
    onNewChat?: () => void;
    onTabChange: (arg0: Tabs) => void;
    selectedTab: Tabs;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function ChatList({
    chats,
    activeChatId,
    onChatClick,
    onNewChat,
    onTabChange,
    selectedTab,
    searchQuery,
    onSearchChange,
}: ChatListProps) {
    return (
        <div className="relative flex min-h-0 flex-1 flex-col">
            <SearchChats
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
            />
            <TabsChats onTabChange={onTabChange} selectedTab={selectedTab}/>

            <div className="flex-1 overflow-y-auto my-2 max-h-[57vh] lg:max-h-[60vh]">
                {chats.length === 0 ? (
                    <EmptyChats onNewChat={onNewChat}/>
                ) : (
                    <ChatsPreview
                        chats={chats}
                        onChatClick={onChatClick}
                        activeChatId={activeChatId}
                    />
                )}
            </div>

            <div className="border-t border-border p-3">
                <button
                    type="button"
                    onClick={onNewChat}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-medium text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
                >
                    <RiAddLine className="w-5 h-5" />
                    New chat
                </button>
            </div>

        </div>
    );
}
