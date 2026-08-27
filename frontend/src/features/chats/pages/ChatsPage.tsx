import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ChatItem } from "@linguachat/shared";
import { getUserChats } from "../api/chatApi";
import ChatList from "../components/ChatList";
import MainArea from "../components/MainArea";
import { socket } from "../../../sockets/socket";
import { CHAT_EVENTS } from "@linguachat/shared";
import { useQueryClient } from "@tanstack/react-query";
import type { Tabs } from "../lib/helpers";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { fetchAndCacheMessageSuggestions } from "../lib/messageSuggestions";
import NewChatModal from "../components/NewChatModal";

export default function ChatsPage() {
    const [activeChatId, setActiveChatId] = useState<string>();
    const [selectedChat, setSelectedChat] = useState<ChatItem>();
    const { data: chats = [] } = useQuery({
        queryKey: ["chats"],
        queryFn: getUserChats,
    });
    const [selectedTab, setSelectedTab] = useState<Tabs>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const { data: currentUser } = useCurrentUser();

    const displayedChats = useMemo(() => {
        const tabChats = (() => {
            switch (selectedTab) {
                case "Unread":
                    return chats.filter((chat) => chat.unreadCount > 0);

                case "Group":
                    return chats.filter((chat) => chat.type === "Group");

                case "Favourites":
                    return chats.filter((chat) => chat.isFavourite === true);

                case "All":
                default:
                    return chats;
            }
        })();

        const normalizedSearchQuery = searchQuery.trim().toLowerCase();

        if (!normalizedSearchQuery) {
            return tabChats;
        }

        return tabChats.filter((chat) =>
            chat.name.toLowerCase().includes(normalizedSearchQuery),
        );
    }, [chats, searchQuery, selectedTab]);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!activeChatId) return;

        socket.emit(CHAT_EVENTS.OPEN_CHAT, {
            chatId: activeChatId,
        });

        return () => {
            socket.emit(CHAT_EVENTS.CLOSE_CHAT, {
                chatId: activeChatId,
            });
        };
    }, [activeChatId]);

    const handleChatClick = async (chat: ChatItem) => {
        if (chat.id === activeChatId) {
            setActiveChatId(undefined);
            setSelectedChat(undefined);
            return;
        }

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

        const lastMessage = chat.lastMessage;
        if (
            lastMessage &&
            lastMessage.sender.id !== currentUser?.id &&
            lastMessage.suggestions === null
        ) {
            const messageSuggestions = await fetchAndCacheMessageSuggestions(
                queryClient,
                chat.id,
                lastMessage.id,
            );

            if (messageSuggestions) {
                setSelectedChat((currentChat) =>
                    currentChat?.id === chat.id &&
                    currentChat.lastMessage.id === lastMessage.id
                        ? {
                              ...currentChat,
                              lastMessage: {
                                  ...currentChat.lastMessage,
                                  suggestions: messageSuggestions,
                              },
                          }
                        : currentChat,
                );
            }
        }
    };

    const handleBackToList = () => {
        setActiveChatId(undefined);
        setSelectedChat(undefined);
    };

    const showMainAreaMobile = activeChatId && selectedChat;

    const handleNewChat = () => setShowNewChat(true);

    return (
        <div className="flex flex-col lg:flex-row min-h[90vh]">
            <aside
                className={`
                    w-full lg:w-80 xl:w-96 bg-surface border-r min-h-[90vh] border-border flex flex-col shrink-0
                    ${activeChatId ? "hidden lg:flex" : "flex"}
                `}
            >
                <ChatList
                    chats={displayedChats}
                    activeChatId={activeChatId}
                    onChatClick={handleChatClick}
                    onTabChange={(tab) => setSelectedTab(tab)}
                    onNewChat={handleNewChat}
                    selectedTab={selectedTab}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
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
                    onNewChat={handleNewChat}
                />
            </div>
            {showNewChat && (
                <NewChatModal
                    onClose={() => setShowNewChat(false)}
                    onChatCreated={(chat) => {
                        setActiveChatId(chat.id);
                        setSelectedChat(chat);
                    }}
                />
            )}
        </div>
    );
}
