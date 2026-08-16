import { z } from "zod";

export const sendFriendRequestSchema = z.object({
    receiverId: z.coerce.number().int().positive("Receiver ID must be a positive integer"),
});

export const updateFriendRequestSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;
export type UpdateFriendRequestInput = z.infer<typeof updateFriendRequestSchema>;
