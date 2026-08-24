import {
    chatMessagesResponseSchema,
    type ChatItem,
    type ChatMessagesResponse,
} from "@linguachat/shared";
import api from "../../../lib/api";

export const chatMessagesQueryKey = (chatId: string) =>
    [`chat-${chatId}`] as const;

export const getUserChats = async (): Promise<ChatItem[]> => {
    const res = await api.get("/chats");
    return res.data.data;
};

export const getChatMessages = async (
    id: string,
    cursor: string | null,
    limit: number,
): Promise<ChatMessagesResponse> => {
    const res = await api.get(`/chats/${id}`, {
        params: {
            limit,
            ...(cursor ? { cursor } : {}),
        },
    });
    return chatMessagesResponseSchema.parse(res.data.data);
};

export const toggleChatFavourite = async (chatId: string) => {
    const res = await api.post(`/chats/${chatId}/favourite`);
    return res.data;
};

export const getMessageSuggestions = async (
    messageId: string,
): Promise<string[]> => {
    const res = await api.post("/chats/ai/message-suggestions", {
        messageId,
    });
    return res.data.data;
};

export const translateMessage = async (
    messageId: string,
    targetLanguage: string,
) => {
    const res = await api.post(`/messages/${messageId}/translate`, {
        targetLanguage: targetLanguage
    });
    return res.data;
};
