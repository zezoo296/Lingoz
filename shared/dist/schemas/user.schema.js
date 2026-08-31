"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryParamsSchema = exports.userStatusSchema = exports.discoveryUsersResponseSchema = exports.updateUserLanguagesSchema = exports.updateUserSchema = exports.userProfileSchema = exports.discoveryUserSchema = exports.userProfileLanguageSchema = exports.discoveryUserLanguageSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
const isoDateSchema = zod_1.z
    .preprocess((value) => (value instanceof Date ? value.toISOString() : value), zod_1.z.iso.datetime())
    .nullable();
/**
 * The authenticated user's frontend-safe profile data.
 *
 * Date values are normalized to ISO strings for API responses.
 */
exports.userSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().nullable(),
    email: zod_1.z.email(),
    birthday: isoDateSchema,
    photo: zod_1.z.string().nullable(),
    gender: zod_1.z.enum(["MALE", "FEMALE"]).nullable(),
    lastSeen: isoDateSchema,
    hasSeenOnboarding: zod_1.z.boolean(),
});
exports.discoveryUserLanguageSchema = zod_1.z.object({
    languageCode: zod_1.z.string(),
    isLearning: zod_1.z.boolean(),
    isSpeaking: zod_1.z.boolean(),
});
exports.userProfileLanguageSchema = exports.discoveryUserLanguageSchema;
/**
 * The minimal, public profile data shown in people discovery.
 */
exports.discoveryUserSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().nullable(),
    username: zod_1.z.string().nullable(),
    photo: zod_1.z.string().nullable(),
    lastSeen: isoDateSchema,
    countryCode: zod_1.z.string().nullable(),
    city: zod_1.z.string().nullable(),
    isOnline: zod_1.z.boolean().default(false),
    userLanguages: zod_1.z.array(exports.discoveryUserLanguageSchema),
});
exports.userProfileSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().nullable(),
    username: zod_1.z.string().nullable(),
    email: zod_1.z.email(),
    birthday: isoDateSchema,
    photo: zod_1.z.string().nullable(),
    gender: zod_1.z.enum(["MALE", "FEMALE"]).nullable(),
    countryCode: zod_1.z.string().nullable(),
    city: zod_1.z.string().nullable(),
    lastSeen: isoDateSchema,
    hasSeenOnboarding: zod_1.z.boolean(),
    userLanguages: zod_1.z.array(exports.userProfileLanguageSchema),
});
const nullableTextField = (max) => zod_1.z.preprocess((value) => (value === "" ? null : value), zod_1.z.string().trim().max(max).nullable().optional());
/** Fields that can be edited from the profile page. The photo is handled by Multer. */
exports.updateUserSchema = zod_1.z.object({
    name: nullableTextField(100),
    username: nullableTextField(30),
    birthday: zod_1.z.preprocess((value) => (value === "" ? null : value), zod_1.z.iso.date().nullable().optional()),
    gender: zod_1.z.preprocess((value) => (value === "" ? null : value), zod_1.z.enum(["MALE", "FEMALE"]).nullable().optional()),
    countryCode: nullableTextField(2),
    city: nullableTextField(100),
});
exports.updateUserLanguagesSchema = zod_1.z.object({
    userLanguages: zod_1.z
        .array(exports.userProfileLanguageSchema)
        .max(20)
        .refine((languages) => new Set(languages.map(({ languageCode }) => languageCode)).size ===
        languages.length, "Each language can only be added once"),
});
exports.discoveryUsersResponseSchema = zod_1.z.object({
    users: zod_1.z.array(exports.discoveryUserSchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.userStatusSchema = zod_1.z.enum(["all", "online", "recent"]);
exports.userQueryParamsSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    speak_language: zod_1.z.string().optional(),
    learn_language: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    status: exports.userStatusSchema.optional(),
});
