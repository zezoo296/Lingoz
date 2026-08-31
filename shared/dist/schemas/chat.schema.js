"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMessagesResponseSchema = exports.groupMessageSchema = exports.directMessageSchema = exports.chatItemSchema = exports.messageSuggestionsSchema = exports.messageStatusSchema = void 0;
const zod_1 = require("zod");
exports.messageStatusSchema = zod_1.z.enum(["UnDelivered", "Delivered", "Read"]);
exports.messageSuggestionsSchema = zod_1.z.object({
    suggestions: zod_1.z.array(zod_1.z.string().trim().min(1).max(200)).length(3),
});
exports.chatItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(["Direct", "Group"]),
    isFavourite: zod_1.z.boolean,
    name: zod_1.z.string(),
    photo: zod_1.z.string(),
    lastMessage: zod_1.z
        .object({
        id: zod_1.z.string(),
        content: zod_1.z.string(),
        created_at: zod_1.z.string(),
        sender: zod_1.z.object({
            id: zod_1.z.number().int(),
            name: zod_1.z.string(),
        }),
        statuses: zod_1.z.array(zod_1.z.object({
            userId: zod_1.z.number().int(),
            status: exports.messageStatusSchema,
        })),
        suggestions: exports.messageSuggestionsSchema.nullable(),
    }),
    unreadCount: zod_1.z.number().int().nonnegative(),
});
exports.directMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    client_id: zod_1.z.string().nullable(),
    chatId: zod_1.z.string(),
    content: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
    senderId: zod_1.z.number(),
    recieverId: zod_1.z.number().nullable(),
    status: exports.messageStatusSchema,
    suggestions: exports.messageSuggestionsSchema.nullable(),
});
exports.groupMessageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    client_id: zod_1.z.string().nullable(),
    chatId: zod_1.z.string(),
    content: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
    sender: zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string().nullable(),
        photo: zod_1.z.string().nullable(),
    }),
    statuses: zod_1.z.array(zod_1.z.object({
        userId: zod_1.z.number(),
        status: exports.messageStatusSchema,
        updatedAt: zod_1.z.coerce.date(),
    })),
    suggestions: exports.messageSuggestionsSchema.nullable(),
});
const directMessagesResponseSchema = zod_1.z.object({
    type: zod_1.z.literal("Direct"),
    messages: zod_1.z.array(exports.directMessageSchema),
    nextCursor: zod_1.z.string().nullable(),
});
const groupMessagesResponseSchema = zod_1.z.object({
    type: zod_1.z.literal("Group"),
    messages: zod_1.z.array(exports.groupMessageSchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.chatMessagesResponseSchema = zod_1.z.discriminatedUnion("type", [
    directMessagesResponseSchema,
    groupMessagesResponseSchema,
]);
