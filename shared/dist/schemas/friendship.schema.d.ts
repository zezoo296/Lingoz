import { z } from "zod";
export declare const sendFriendRequestSchema: z.ZodObject<{
    receiverId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const updateFriendRequestSchema: z.ZodObject<{
    status: z.ZodEnum<{
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
    }>;
}, z.core.$strip>;
export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
export type UpdateFriendRequestInput = z.infer<typeof updateFriendRequestSchema>;
