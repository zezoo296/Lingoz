import { RiAddLine } from "react-icons/ri";
import type { ChatItem } from "@linguachat/shared";
import EmptyChats from "./EmptyChats";
import SearchChats from "./SearchChats";
import TabsChats from "./TabsChats";
import ChatsPreview from "./ChatsPreview";

interface ChatListProps {
    chats: ChatItem[];
    activeChatId?: string;
    onChatClick?: (chat: ChatItem) => void;
    onNewChat?: () => void;
}

export default function ChatList({
    chats,
    activeChatId,
    onChatClick,
}: ChatListProps) {
    return (
        <>
            <SearchChats />
            <TabsChats />

            <div className="flex-1 overflow-y-auto my-2 max-h-[57vh] lg:max-h-[60vh]">
                {chats.length === 0 ? (
                    <EmptyChats />
                ) : (
                    <ChatsPreview
                        chats={chats}
                        onChatClick={onChatClick}
                        activeChatId={activeChatId}
                    />
                )}
            </div>

            <div className="p-3 border-t border-border">
                <button className="w-full py-3 rounded-xl bg-brand-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
                    <RiAddLine className="w-5 h-5" />
                    New chat
                </button>
            </div>
        </>
    );
}
