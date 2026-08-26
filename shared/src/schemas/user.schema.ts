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

export const discoveryUserLanguageSchema = z.object({
    languageCode: z.string(),
    isLearning: z.boolean(),
    isSpeaking: z.boolean(),
});

/**
 * The minimal, public profile data shown in people discovery.
 */
export const discoveryUserSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().nullable(),
    username: z.string().nullable(),
    photo: z.string().nullable(),
    lastSeen: isoDateSchema,
    countryCode: z.string().nullable(),
    city: z.string().nullable(),
    isOnline: z.boolean().default(false),
    userLanguages: z.array(discoveryUserLanguageSchema),
});

export const discoveryUsersResponseSchema = z.object({
    users: z.array(discoveryUserSchema),
    nextCursor: z.string().nullable(),
});

export const userStatusSchema = z.enum(["all", "online", "recent"]);

export const userQueryParamsSchema = z.object({
    search: z.string().optional(),
    speak_language: z.string().optional(),
    learn_language: z.string().optional(),
    country: z.string().optional(),
    status: userStatusSchema.optional(),
});

export type UserStatus = z.infer<typeof userStatusSchema>;
export type UserQueryParams = z.infer<typeof userQueryParamsSchema>;
export type AuthenticatedUser = z.infer<typeof userSchema>;
export type DiscoveryUser = z.infer<typeof discoveryUserSchema>;
export type DiscoveryUsersResponse = z.infer<
    typeof discoveryUsersResponseSchema
>;
