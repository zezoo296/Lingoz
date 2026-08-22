import type { ChatItem } from "@linguachat/shared";
import MainAreaEmptyChats from "./MainAreaEmptyChats";
import NonActiveChats from "./NonActiveChats";
import { MainAreaActiveChat } from "./MainAreaActiveChat";

interface ChatListProps {
    chats: ChatItem[];
    activeChatId?: string;
    selectedChat?: ChatItem;
    onBackToList?: () => void;
    onNewChat?: () => void;
}

export default function MainArea({
    chats,
    activeChatId,
    selectedChat,
    onBackToList,
    onNewChat,
}: ChatListProps) {
    if (!chats || chats.length === 0) {
        return <MainAreaEmptyChats />;
    }

    if (!activeChatId || !selectedChat) {
        return <NonActiveChats onNewChat={onNewChat} />;
    }

    return (
        <MainAreaActiveChat
            activeChatId={activeChatId}
            selectedChat={selectedChat}
            onBackToList={onBackToList}
        />
    );
}
