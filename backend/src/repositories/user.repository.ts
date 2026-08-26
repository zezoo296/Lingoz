import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { encodeCursor, type Cursor } from "../utils/cursor";
import type { UserQueryParams } from "@linguachat/shared";

//userId is int
const olderThanUserCursor = (cursor: Cursor): Prisma.UserWhereInput => ({
    OR: [
        { createdAt: { lt: cursor.createdAt } },
        {
            createdAt: cursor.createdAt,
            id: { lt: Number(cursor.id) },
        },
    ],
});

const paginateUsers = <T extends { id: number; createdAt: Date }>(
    rows: T[],
    limit: number,
) => {
    const hasMore = rows.length > limit;
    const users = hasMore ? rows.slice(0, limit) : rows;
    const lastUser = users[users.length - 1];
    const nextCursor =
        hasMore && lastUser
            ? encodeCursor({
                  createdAt: lastUser.createdAt,
                  id: String(lastUser.id),
              })
            : null;

    return {
        users: users.map(({ createdAt: _createdAt, ...user }) => user),
        nextCursor,
    };
};

export const findUserById = (id: number) => {
    return prisma.user.findFirst({
        where: {
            id,
        },
        omit: {
            password: true,
            googleId: true,
        },
    });
};

export const findUserByEmail = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email,
        },
    });
};

export const findUsers = (where: Prisma.UserWhereInput = {}) => {
    return prisma.user.findMany({
        where,
    });
};

export const createUser = (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
        data,
    });
};

export const updateUser = (id: number, data: Prisma.UserUpdateInput) => {
    return prisma.user.update({
        where: { id },
        data: data,
    });
};

export const updateUserPasswordResetOtp = (
    id: number,
    otpHash: string,
    expiresAt: Date,
) => {
    return prisma.user.update({
        where: { id },
        data: {
            passwordResetOtpHash: otpHash,
            passwordResetOtpExpiresAt: expiresAt,
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
        },
    });
};

export const updateUserPasswordResetToken = (
    id: number,
    tokenHash: string,
    expiresAt: Date,
) => {
    return prisma.user.update({
        where: { id },
        data: {
            passwordResetTokenHash: tokenHash,
            passwordResetTokenExpiresAt: expiresAt,
            passwordResetOtpHash: null,
            passwordResetOtpExpiresAt: null,
        },
    });
};

export const updateUserPassword = (id: number, hashedPassword: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
            passwordResetOtpHash: null,
            passwordResetOtpExpiresAt: null,
        },
    });
};

export const findUserByResetTokenHash = (tokenHash: string) => {
    return prisma.user.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
        },
    });
};

export const findByEmailOrGoogleId = (email: string, googleId: string) => {
    return prisma.user.findFirst({
        where: {
            OR: [{ googleId }, { email }],
        },
    });
};

import { redis } from "../config/redis";
import { redisKeys } from "../redis/keys";

export const getUsersRepo = async (
    userId: number,
    limit: number,
    cursor?: Cursor,
    queryParams: UserQueryParams = {},
) => {
    const {
        search,
        speak_language: speakLanguage,
        learn_language: learnLanguage,
        country,
        status,
    } = queryParams;

    let onlineUserIds: number[] | undefined;

    if (status === "online") {
        const ids = await redis.smembers(redisKeys.onlineUsers());

        onlineUserIds = ids.map(Number);

        // No online users -> immediately return an empty page
        if (onlineUserIds.length === 0) {
            return {
                users: [],
                nextCursor: null,
            };
        }
    }

    const rows = await prisma.user.findMany({
        where: {
            id: {
                not: userId,
                ...(onlineUserIds
                    ? {
                          in: onlineUserIds,
                      }
                    : {}),
            },

            friendships: {
                none: {
                    friendId: userId,
                },
            },

            AND: [
                {
                    sentRequests: {
                        none: {
                            receiverId: userId,
                            status: "PENDING",
                        },
                    },
                },
                {
                    receivedRequests: {
                        none: {
                            senderId: userId,
                            status: "PENDING",
                        },
                    },
                },

                ...(speakLanguage
                    ? [
                          {
                              userLanguages: {
                                  some: {
                                      languageCode: speakLanguage,
                                      isSpeaking: true,
                                  },
                              },
                          },
                      ]
                    : []),

                ...(learnLanguage
                    ? [
                          {
                              userLanguages: {
                                  some: {
                                      languageCode: learnLanguage,
                                      isLearning: true,
                                  },
                              },
                          },
                      ]
                    : []),
            ],

            ...(cursor ? olderThanUserCursor(cursor) : {}),

            ...(search
                ? {
                      OR: [
                          {
                              name: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                          {
                              username: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                      ],
                  }
                : {}),

            ...(country
                ? {
                      countryCode: country,
                  }
                : {}),

            ...(status === "recent"
                ? {
                      lastSeen: {
                          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                      },
                  }
                : {}),
        },

        select: {
            id: true,
            createdAt: true,
            name: true,
            username: true,
            countryCode: true,
            city: true,
            photo: true,
            lastSeen: true,

            userLanguages: {
                select: {
                    languageCode: true,
                    isLearning: true,
                    isSpeaking: true,
                },
            },
        },

        orderBy: [
            {
                createdAt: "desc",
            },
            {
                id: "desc",
            },
        ],

        take: limit + 1,
    });

    return paginateUsers(rows, limit);
};
