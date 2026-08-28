import { redis } from "../config/redis";
import cloudinary from "../config/cloudnary";
import { redisKeys } from "../redis/keys";
import { Prisma } from "../generated/prisma/client";
import {
    getUserProfileRepo,
    getUsersRepo,
    updateUserProfileRepo,
    replaceUserLanguagesRepo,
} from "../repositories/user.repository";
import AppError from "../utils/AppError";
import { decodeCursor } from "../utils/cursor";
import {
    discoveryUsersResponseSchema,
    userProfileSchema,
    type UpdateUserInput,
    type UpdateUserLanguagesInput,
    type DiscoveryUser,
    type UserQueryParams,
} from "@linguachat/shared";

export const getUsersService = async (
    userId: number,
    cursor: string | undefined,
    limit: number,
    queryParams: UserQueryParams,
) => {
    if (limit > 20) limit = 20;

    const decodedCursor = cursor ? decodeCursor(cursor) : undefined;

    const { users: repoUsers, nextCursor } = await getUsersRepo(
        userId,
        limit,
        decodedCursor,
        queryParams,
    );

    const users: DiscoveryUser[] = await Promise.all(
        repoUsers.map(async (user) => {
            const isOnline =
                queryParams.status === "online"
                    ? true
                    : (await redis.scard(redisKeys.userSockets(user.id))) > 0;

            return {
                ...user,
                lastSeen: user.lastSeen?.toISOString() ?? null,
                isOnline,
            };
        }),
    );

    const response = discoveryUsersResponseSchema.safeParse({
        users,
        nextCursor,
    });

    if (!response.success) {
        throw new AppError(response.error.message, 500);
    }

    return response.data;
};


export const getMeService = async (userId?: number) => {
    if (!userId) throw new AppError("UnAuthenticated", 401);
    const userData = await getUserProfileRepo(userId);
    if (!userData) throw new AppError("User not found", 404);

    const response = userProfileSchema.safeParse({
        ...userData,
        photo: userData.photoUrl ?? userData.photo,
        lastSeen: userData.lastSeen?.toISOString() ?? null,
        birthday: userData.birthday?.toISOString() ?? null,
        userLanguages: userData.userLanguages.map((language) => ({
            languageCode: language.languageCode,
            isLearning: language.isLearning,
            isSpeaking: language.isSpeaking,
        })),
    });

    if (!response.success) {
        throw new AppError(response.error.message, 500);
    }

    return response.data;
};


export const updateMeService = async (
    userId: number | undefined,
    data: UpdateUserInput,
    file?: Express.Multer.File,
) => {
    if (!userId) throw new AppError("UnAuthenticated", 401);

    const currentUser = await getUserProfileRepo(userId);
    if (!currentUser) throw new AppError("User not found", 404);

    let uploadedPhoto: { secure_url: string; public_id: string } | undefined;

    if (file) {
        try {
            uploadedPhoto = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "lingoz/profile-photos", resource_type: "image" },
                    (error, result) => {
                        if (error || !result) {
                            reject(error ?? new Error("Cloudinary upload failed"));
                            return;
                        }

                        resolve({
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                        });
                    },
                );

                stream.end(file.buffer);
            });
        } catch {
            throw new AppError("Unable to upload profile photo", 502);
        }
    }

    const updateData: Prisma.UserUpdateInput = {
        name: data.name ?? null,
        username: data.username ?? null,
        birthday: data.birthday ? new Date(`${data.birthday}T00:00:00.000Z`) : null,
        gender: data.gender ?? null,
        countryCode: data.countryCode ?? null,
        city: data.city ?? null,
    };

    if (uploadedPhoto) {
        updateData.photo = uploadedPhoto.secure_url;
        updateData.photoUrl = uploadedPhoto.secure_url;
        updateData.photoPublicId = uploadedPhoto.public_id;
    }

    try {
        await updateUserProfileRepo(userId, updateData);
    } catch (error) {
        if (uploadedPhoto) {
            await cloudinary.uploader.destroy(uploadedPhoto.public_id).catch(() => undefined);
        }
        throw error;
    }

    const oldPublicId = currentUser.photoPublicId;
    if (uploadedPhoto && oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId).catch(() => undefined);
    }

    return getMeService(userId);
};

export const updateUserLanguagesService = async (
    userId: number | undefined,
    { userLanguages }: UpdateUserLanguagesInput,
) => {
    if (!userId) throw new AppError("UnAuthenticated", 401);

    const currentUser = await getUserProfileRepo(userId);
    if (!currentUser) throw new AppError("User not found", 404);

    await replaceUserLanguagesRepo(
        userId,
        userLanguages.map((language) => ({
            userId,
            languageCode: language.languageCode,
            isLearning: language.isLearning,
            isSpeaking: language.isSpeaking,
        })),
    );

    return getMeService(userId);
};
