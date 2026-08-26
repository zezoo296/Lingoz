import { redis } from "../config/redis";
import { redisKeys } from "../redis/keys";
import { getUsersRepo } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import { decodeCursor } from "../utils/cursor";
import {
    discoveryUsersResponseSchema,
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
