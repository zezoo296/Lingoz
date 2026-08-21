import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChatItem } from "@linguachat/shared";
import { getUserChats } from "../api/chatApi";
import ChatList from "../components/ChatList";
import MainArea from "../components/MainArea";
import Suggested from "../components/Suggested";
import { socket } from "../../../sockets/socket";
import { CHAT_EVENTS } from "@linguachat/shared";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatsPage() {
    const [activeChatId, setActiveChatId] = useState<string>();
    const [selectedChat, setSelectedChat] = useState<ChatItem>();
    const { data: chats = [] } = useQuery({
        queryKey: ["chats"],
        queryFn: getUserChats,
    });

    const queryClient = useQueryClient();

    const handleChatClick = (chat: ChatItem) => {
        if (chat.id === activeChatId) {
            socket.emit(CHAT_EVENTS.CLOSE_CHAT, { chatId: chat.id });

            setActiveChatId(undefined);
            setSelectedChat(undefined);

            return;
        }

        socket.emit(CHAT_EVENTS.OPEN_CHAT, { chatId: chat.id });

        setActiveChatId(chat.id);
        setSelectedChat(chat);

        if (chat.unreadCount > 0) {
            queryClient.setQueryData<ChatItem[]>(["chats"], (oldChats) => {
                if (!oldChats) return oldChats;

                return oldChats.map((chatItem) =>
                    chatItem.id === chat.id
                        ? {
                              ...chatItem,
                              unreadCount: 0,
                          }
                        : chatItem,
                );
            });
        }
    };

    const handleBackToList = () => {
        socket.emit(CHAT_EVENTS.CLOSE_CHAT, { chatId: activeChatId });
        setActiveChatId(undefined);
        setSelectedChat(undefined);
    };

    const showMainAreaMobile = activeChatId && selectedChat;

    return (
        <div className="flex flex-col lg:flex-row">
            <aside
                className={`
                    w-full lg:w-80 xl:w-96 bg-surface border-r border-border flex flex-col shrink-0
                    ${activeChatId ? "hidden lg:flex" : "flex"}
                `}
            >
                <ChatList
                    chats={chats}
                    activeChatId={activeChatId}
                    onChatClick={handleChatClick}
                    onNewChat={() => console.log("New chat")}
                />
                {chats.length <= 2 && <Suggested />}
            </aside>

            <div
                className={`
                    flex-1
                    ${!showMainAreaMobile ? "hidden lg:flex" : "block"}
                `}
            >
                <MainArea
                    chats={chats}
                    activeChatId={activeChatId}
                    selectedChat={selectedChat}
                    onBackToList={handleBackToList}
                    onNewChat={() => console.log("New chat")}
                />
            </div>
        </div>
    );
}
