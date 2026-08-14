import { z } from "zod";

const isoDateSchema = z
    .preprocess(
        (value) => (value instanceof Date ? value.toISOString() : value),
        z.iso.datetime(),
    )
    .nullable();

/**
 * The authenticated user's frontend-safe profile data.
 *
 * Date values are normalized to ISO strings for API responses.
 */
export const userSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().nullable(),
    email: z.email(),
    birthday: isoDateSchema,
    photo: z.string().nullable(),
    gender: z.enum(["MALE", "FEMALE"]).nullable(),
    lastSeen: isoDateSchema,
    hasSeenOnboarding: z.boolean(),
});

export type AuthenticatedUser = z.infer<typeof userSchema>;
