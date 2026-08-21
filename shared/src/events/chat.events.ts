import { z } from "zod";

export const CHAT_EVENTS = {
    NEW_MESSAGE: "new-message",
    OPEN_CHAT: "open-chat",
    CLOSE_CHAT: "close-chat",
    MESSAGES_DELIVERED: "messages-delivered",
};

export const newMessageInputSchema = z.object({
    id: z.string(),
    chatId: z.string(),
    content: z.string(),
});

export const openChatInputSchema = z.object({
    chatId: z.string()
})

export const chatOpenedSchema = z.object({
    chatId: z.string(),
    userId: z.number().int(),
});

export const messagesDeliveredSchema = z.object({
    chatId: z.string(),
    userId: z.number().int(),
});


export type NewMessageInput = z.infer<typeof newMessageInputSchema>;
export type OpenChatInput = z.infer<typeof openChatInputSchema>;
export type ChatOpenedEvent = z.infer<typeof chatOpenedSchema>;
export type MessagesDeliveredEvent = z.infer<typeof messagesDeliveredSchema>;
