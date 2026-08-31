import { z } from "zod";
export declare const CHAT_EVENTS: {
    NEW_MESSAGE: string;
    OPEN_CHAT: string;
    CLOSE_CHAT: string;
    MESSAGES_DELIVERED: string;
};
export declare const newMessageInputSchema: z.ZodObject<{
    id: z.ZodString;
    chatId: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export declare const openChatInputSchema: z.ZodObject<{
    chatId: z.ZodString;
}, z.core.$strip>;
export declare const chatOpenedSchema: z.ZodObject<{
    chatId: z.ZodString;
    userId: z.ZodNumber;
}, z.core.$strip>;
export declare const messagesDeliveredSchema: z.ZodObject<{
    chatId: z.ZodString;
    userId: z.ZodNumber;
}, z.core.$strip>;
export type NewMessageInput = z.infer<typeof newMessageInputSchema>;
export type OpenChatInput = z.infer<typeof openChatInputSchema>;
export type ChatOpenedEvent = z.infer<typeof chatOpenedSchema>;
export type MessagesDeliveredEvent = z.infer<typeof messagesDeliveredSchema>;
