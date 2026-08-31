import { z } from "zod";
export declare const messageStatusSchema: z.ZodEnum<{
    UnDelivered: "UnDelivered";
    Delivered: "Delivered";
    Read: "Read";
}>;
export declare const messageSuggestionsSchema: z.ZodObject<{
    suggestions: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const chatItemSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        Direct: "Direct";
        Group: "Group";
    }>;
    isFavourite: typeof z.boolean;
    name: z.ZodString;
    photo: z.ZodString;
    lastMessage: z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        created_at: z.ZodString;
        sender: z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
        }, z.core.$strip>;
        statuses: z.ZodArray<z.ZodObject<{
            userId: z.ZodNumber;
            status: z.ZodEnum<{
                UnDelivered: "UnDelivered";
                Delivered: "Delivered";
                Read: "Read";
            }>;
        }, z.core.$strip>>;
        suggestions: z.ZodNullable<z.ZodObject<{
            suggestions: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    unreadCount: z.ZodNumber;
}, z.core.$strip>;
export declare const directMessageSchema: z.ZodObject<{
    id: z.ZodString;
    client_id: z.ZodNullable<z.ZodString>;
    chatId: z.ZodString;
    content: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    senderId: z.ZodNumber;
    recieverId: z.ZodNullable<z.ZodNumber>;
    status: z.ZodEnum<{
        UnDelivered: "UnDelivered";
        Delivered: "Delivered";
        Read: "Read";
    }>;
    suggestions: z.ZodNullable<z.ZodObject<{
        suggestions: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const groupMessageSchema: z.ZodObject<{
    id: z.ZodString;
    client_id: z.ZodNullable<z.ZodString>;
    chatId: z.ZodString;
    content: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    sender: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodNullable<z.ZodString>;
        photo: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    statuses: z.ZodArray<z.ZodObject<{
        userId: z.ZodNumber;
        status: z.ZodEnum<{
            UnDelivered: "UnDelivered";
            Delivered: "Delivered";
            Read: "Read";
        }>;
        updatedAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>;
    suggestions: z.ZodNullable<z.ZodObject<{
        suggestions: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const chatMessagesResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"Direct">;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        client_id: z.ZodNullable<z.ZodString>;
        chatId: z.ZodString;
        content: z.ZodString;
        createdAt: z.ZodCoercedDate<unknown>;
        senderId: z.ZodNumber;
        recieverId: z.ZodNullable<z.ZodNumber>;
        status: z.ZodEnum<{
            UnDelivered: "UnDelivered";
            Delivered: "Delivered";
            Read: "Read";
        }>;
        suggestions: z.ZodNullable<z.ZodObject<{
            suggestions: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"Group">;
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        client_id: z.ZodNullable<z.ZodString>;
        chatId: z.ZodString;
        content: z.ZodString;
        createdAt: z.ZodCoercedDate<unknown>;
        sender: z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodNullable<z.ZodString>;
            photo: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
        statuses: z.ZodArray<z.ZodObject<{
            userId: z.ZodNumber;
            status: z.ZodEnum<{
                UnDelivered: "UnDelivered";
                Delivered: "Delivered";
                Read: "Read";
            }>;
            updatedAt: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>;
        suggestions: z.ZodNullable<z.ZodObject<{
            suggestions: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>], "type">;
export type MessageSuggestions = z.infer<typeof messageSuggestionsSchema>;
export type ChatItem = z.infer<typeof chatItemSchema>;
export type DirectMessage = z.infer<typeof directMessageSchema>;
export type GroupMessage = z.infer<typeof groupMessageSchema>;
export type ChatMessagesResponse = z.infer<typeof chatMessagesResponseSchema>;
