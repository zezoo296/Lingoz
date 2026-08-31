"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesDeliveredSchema = exports.chatOpenedSchema = exports.openChatInputSchema = exports.newMessageInputSchema = exports.CHAT_EVENTS = void 0;
const zod_1 = require("zod");
exports.CHAT_EVENTS = {
    NEW_MESSAGE: "new-message",
    OPEN_CHAT: "open-chat",
    CLOSE_CHAT: "close-chat",
    MESSAGES_DELIVERED: "messages-delivered",
};
exports.newMessageInputSchema = zod_1.z.object({
    id: zod_1.z.string(),
    chatId: zod_1.z.string(),
    content: zod_1.z.string(),
});
exports.openChatInputSchema = zod_1.z.object({
    chatId: zod_1.z.string()
});
exports.chatOpenedSchema = zod_1.z.object({
    chatId: zod_1.z.string(),
    userId: zod_1.z.number().int(),
});
exports.messagesDeliveredSchema = zod_1.z.object({
    chatId: zod_1.z.string(),
    userId: zod_1.z.number().int(),
});
