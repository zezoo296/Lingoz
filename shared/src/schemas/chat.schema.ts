import { z } from "zod";

export const messageStatusSchema = z.enum(["UnDelivered", "Delivered", "Read"]);

export const messageSuggestionsSchema = z.object({
    suggestions: z.array(z.string().trim().min(1).max(200)).length(3),
});

export const chatItemSchema = z.object({
    id: z.string(),
    type: z.enum(["Direct", "Group"]),
    isFavourite: z.boolean,
    name: z.string(),
    photo: z.string(),
    lastMessage: z.object({
        id: z.string(),
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
        suggestions: messageSuggestionsSchema.nullable()
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
    suggestions: messageSuggestionsSchema.nullable(),
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

    suggestions: messageSuggestionsSchema.nullable(),
});

const directMessagesResponseSchema = z.object({
    type: z.literal("Direct"),
    messages: z.array(directMessageSchema),
    nextCursor: z.string().nullable(),
});

const groupMessagesResponseSchema = z.object({
    type: z.literal("Group"),
    messages: z.array(groupMessageSchema),
    nextCursor: z.string().nullable(),
});

export const chatMessagesResponseSchema = z.discriminatedUnion("type", [
    directMessagesResponseSchema,
    groupMessagesResponseSchema,
]);

export type MessageSuggestions = z.infer<typeof messageSuggestionsSchema>;
export type ChatItem = z.infer<typeof chatItemSchema>;
export type DirectMessage = z.infer<typeof directMessageSchema>;
export type GroupMessage = z.infer<typeof groupMessageSchema>;
export type ChatMessagesResponse = z.infer<typeof chatMessagesResponseSchema>;
