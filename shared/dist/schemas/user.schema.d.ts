import { z } from "zod";
/**
 * The authenticated user's frontend-safe profile data.
 *
 * Date values are normalized to ISO strings for API responses.
 */
export declare const userSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodEmail;
    birthday: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
    photo: z.ZodNullable<z.ZodString>;
    gender: z.ZodNullable<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>;
    lastSeen: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
    hasSeenOnboarding: z.ZodBoolean;
}, z.core.$strip>;
export declare const discoveryUserLanguageSchema: z.ZodObject<{
    languageCode: z.ZodString;
    isLearning: z.ZodBoolean;
    isSpeaking: z.ZodBoolean;
}, z.core.$strip>;
export declare const userProfileLanguageSchema: z.ZodObject<{
    languageCode: z.ZodString;
    isLearning: z.ZodBoolean;
    isSpeaking: z.ZodBoolean;
}, z.core.$strip>;
/**
 * The minimal, public profile data shown in people discovery.
 */
export declare const discoveryUserSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    username: z.ZodNullable<z.ZodString>;
    photo: z.ZodNullable<z.ZodString>;
    lastSeen: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
    countryCode: z.ZodNullable<z.ZodString>;
    city: z.ZodNullable<z.ZodString>;
    isOnline: z.ZodDefault<z.ZodBoolean>;
    userLanguages: z.ZodArray<z.ZodObject<{
        languageCode: z.ZodString;
        isLearning: z.ZodBoolean;
        isSpeaking: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const userProfileSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    username: z.ZodNullable<z.ZodString>;
    email: z.ZodEmail;
    birthday: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
    photo: z.ZodNullable<z.ZodString>;
    gender: z.ZodNullable<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>;
    countryCode: z.ZodNullable<z.ZodString>;
    city: z.ZodNullable<z.ZodString>;
    lastSeen: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
    hasSeenOnboarding: z.ZodBoolean;
    userLanguages: z.ZodArray<z.ZodObject<{
        languageCode: z.ZodString;
        isLearning: z.ZodBoolean;
        isSpeaking: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Fields that can be edited from the profile page. The photo is handled by Multer. */
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    username: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    birthday: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodISODate>>>;
    gender: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>>>;
    countryCode: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    city: z.ZodPreprocess<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
export declare const updateUserLanguagesSchema: z.ZodObject<{
    userLanguages: z.ZodArray<z.ZodObject<{
        languageCode: z.ZodString;
        isLearning: z.ZodBoolean;
        isSpeaking: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const discoveryUsersResponseSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodNullable<z.ZodString>;
        username: z.ZodNullable<z.ZodString>;
        photo: z.ZodNullable<z.ZodString>;
        lastSeen: z.ZodNullable<z.ZodPreprocess<z.ZodISODateTime>>;
        countryCode: z.ZodNullable<z.ZodString>;
        city: z.ZodNullable<z.ZodString>;
        isOnline: z.ZodDefault<z.ZodBoolean>;
        userLanguages: z.ZodArray<z.ZodObject<{
            languageCode: z.ZodString;
            isLearning: z.ZodBoolean;
            isSpeaking: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const userStatusSchema: z.ZodEnum<{
    all: "all";
    online: "online";
    recent: "recent";
}>;
export declare const userQueryParamsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    speak_language: z.ZodOptional<z.ZodString>;
    learn_language: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        all: "all";
        online: "online";
        recent: "recent";
    }>>;
}, z.core.$strip>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type UserQueryParams = z.infer<typeof userQueryParamsSchema>;
export type AuthenticatedUser = z.infer<typeof userSchema>;
export type DiscoveryUser = z.infer<typeof discoveryUserSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserLanguagesInput = z.infer<typeof updateUserLanguagesSchema>;
export type DiscoveryUsersResponse = z.infer<typeof discoveryUsersResponseSchema>;
