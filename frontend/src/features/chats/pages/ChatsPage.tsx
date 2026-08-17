import Suggested from "../components/Suggested";
import type { ChatItem } from "../components/ChatList";
import ChatList from "../components/ChatList";
import MainArea from "../components/MainArea";
import { useState } from "react";

const myChats: ChatItem[] = [
    {
        id: "1",
        name: "Lucía Fernández",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        lastMessage:
            "Hey! Are you free for a Spanish practice session tonight?",
        timestamp: "2m",
        unreadCount: 2,
        isUnread: true,
        onlineStatus: "online",
    },
    {
        id: "2",
        name: "Hiroshi Nakamura",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        lastMessage: "I found a great Japanese podcast for beginners!",
        timestamp: "15m",
        unreadCount: 1,
        isUnread: true,
        onlineStatus: "online",
    },
    // {
    //     id: "3",
    //     name: "Camille Dubois",
    //     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    //     lastMessage: "Merci beaucoup! That really helped me understand.",
    //     timestamp: "1h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "away",
    //     isOwnMessage: true,
    //     isRead: true,
    // },
    // {
    //     id: "4",
    //     name: "Arjun Patel",
    //     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    //     lastMessage:
    //         "Let me know when you're back, I have some Hindi phrases to share!",
    //     timestamp: "3h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "offline",
    //     isOwnMessage: true,
    //     isRead: false,
    // },
    // {
    //     id: "5",
    //     name: "Spanish Learners 🇪🇸",
    //     avatar: "",
    //     lastMessage: "Anyone want to practice subjunctive tense?",
    //     timestamp: "5h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "online",
    //     isGroup: true,
    //     groupMemberCount: 12,
    //     senderName: "Maria",
    // },
    // {
    //     id: "5",
    //     name: "Spanish Learners 🇪🇸",
    //     avatar: "",
    //     lastMessage: "Anyone want to practice subjunctive tense?",
    //     timestamp: "5h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "online",
    //     isGroup: true,
    //     groupMemberCount: 12,
    //     senderName: "Maria",
    // },
    // {
    //     id: "5",
    //     name: "Spanish Learners 🇪🇸",
    //     avatar: "",
    //     lastMessage: "Anyone want to practice subjunctive tense?",
    //     timestamp: "5h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "online",
    //     isGroup: true,
    //     groupMemberCount: 12,
    //     senderName: "Maria",
    // },
    // {
    //     id: "5",
    //     name: "Spanish Learners 🇪🇸",
    //     avatar: "",
    //     lastMessage: "Anyone want to practice subjunctive tense?",
    //     timestamp: "5h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "online",
    //     isGroup: true,
    //     groupMemberCount: 12,
    //     senderName: "Maria",
    // },
    // {
    //     id: "5",
    //     name: "Spanish Learners 🇪🇸",
    //     avatar: "",
    //     lastMessage: "Anyone want to practice subjunctive tense?",
    //     timestamp: "5h",
    //     unreadCount: 0,
    //     isUnread: false,
    //     onlineStatus: "online",
    //     isGroup: true,
    //     groupMemberCount: 12,
    //     senderName: "Maria",
    // },
];

// const myChats: string | any[] = []

export default function ChatsPage() {
    const [activeChatId, setActiveChatId] = useState<string | undefined>(
        undefined,
    );
    const [selectedChat, setSelectedChat] = useState<ChatItem | undefined>(
        myChats[0],
    );

    const handleChatClick = (chat: ChatItem) => {
        if (chat.id === activeChatId) {
            setActiveChatId(undefined);
            setSelectedChat(undefined);
            return;
        }
        setActiveChatId(chat.id);
        setSelectedChat(chat);
    };

    const handleBackToList = () => {
        setActiveChatId(undefined);
        setSelectedChat(undefined);
    };

    const showMainAreaMobile = activeChatId && selectedChat;
    return (
        <div className="flex flex-col lg:flex-row">
            {/* ── Sidebar ── */}
            <aside
                className={`
                    w-full lg:w-80 xl:w-96 bg-surface border-r border-border flex flex-col shrink-0
                    ${activeChatId ? "hidden lg:flex" : "flex"}
                    
                `}
            >
                <ChatList
                    chats={myChats}
                    activeChatId={activeChatId}
                    onChatClick={handleChatClick}
                    onNewChat={() => console.log("New chat")}
                />
                {myChats && myChats.length <= 2 && <Suggested />}
            </aside>

            <div
                className={`
                    flex-1
                    ${!showMainAreaMobile ? "hidden lg:flex" : "block"}
                `}
            >
                <MainArea
                    chats={myChats}
                    activeChatId={activeChatId}
                    selectedChat={selectedChat}
                    onChatClick={handleChatClick}
                    onBackToList={handleBackToList}
                    onNewChat={() => console.log("New chat")}
                />
            </div>
        </div>
    );
}
