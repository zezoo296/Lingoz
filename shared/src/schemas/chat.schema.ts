import { z } from "zod";

export const messageStatusSchema = z.enum(["UnDelivered", "Delivered", "Read"]);

export const chatItemSchema = z.object({
    id: z.string(),
    type: z.enum(["Direct", "Group"]),

    name: z.string(),
    photo: z.string(),
    lastMessage: z.object({
        content: z.string(),
        created_at: z.string(),
        sender: z.object({
            id: z.number().int(),
            name: z.string(),
        }),
        statuses: z.array(
            z.object({
                userId: z.number().int(),
                status: messageStatusSchema,
            }),
        ),
    }),
    unreadCount: z.number().int().nonnegative(),
});

export const directMessageSchema = z.object({
    id: z.string(),
    client_id: z.string().nullable(),
    chatId: z.string(),
    content: z.string(),
    createdAt: z.coerce.date(),
    senderId: z.number(),
    recieverId: z.number().nullable(),
    status: messageStatusSchema,
});

export const groupMessageSchema = z.object({
    id: z.string(),
    client_id: z.string().nullable(),
    chatId: z.string(),
    content: z.string(),
    createdAt: z.coerce.date(),

    sender: z.object({
        id: z.number(),
        name: z.string().nullable(),
        photo: z.string().nullable(),
    }),

    statuses: z.array(
        z.object({
            userId: z.number(),
            status: messageStatusSchema,
            updatedAt: z.coerce.date(),
        }),
    ),
});

const directMessagesResponseSchema = z.object({
    type: z.literal("Direct"),
    messages: z.array(directMessageSchema),
});

const groupMessagesResponseSchema = z.object({
    type: z.literal("Group"),
    messages: z.array(groupMessageSchema),
});

export const chatMessagesResponseSchema = z.discriminatedUnion("type", [
    directMessagesResponseSchema,
    groupMessagesResponseSchema,
]);

export type ChatItem = z.infer<typeof chatItemSchema>;
export type DirectMessage = z.infer<typeof directMessageSchema>;
export type GroupMessage = z.infer<typeof groupMessageSchema>;
export type ChatMessagesResponse = z.infer<typeof chatMessagesResponseSchema>;
