import prisma from "../config/prisma";
import { FriendRequestStatus, Prisma } from "../generated/prisma/client";

export const approveFriendRequest = (
    userA: number,
    userB: number,
    requestId: string,
) => {
    return prisma.$transaction([
        prisma.friendship.create({
            data: {
                userId: userA,
                friendId: userB,
            },
        }),

        prisma.friendship.create({
            data: {
                userId: userB,
                friendId: userA,
            },
        }),

        prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" },
        }),
    ]);
};

export const removeFriendship = (userA: number, userB: number) => {
    return prisma.$transaction([
        prisma.friendship.delete({
            where: {
                userId_friendId: {
                    userId: userA,
                    friendId: userB,
                },
            },
        }),

        prisma.friendship.delete({
            where: {
                userId_friendId: {
                    userId: userB,
                    friendId: userA,
                },
            },
        }),

        prisma.friendRequest.deleteMany({
            where: {
                OR: [
                    { senderId: userA, receiverId: userB },
                    { senderId: userB, receiverId: userA },
                ],
            },
        }),
    ]);
};

export const createFriendRequest = (
    data: Prisma.FriendRequestUncheckedCreateInput,
) => {
    return prisma.friendRequest.create({
        data,
    });
};

export const updateFriendRequestStatus = (
    id: string,
    status: FriendRequestStatus,
) => {
    return prisma.friendRequest.update({
        where: { id },
        data: { status },
    });
};

export const deleteFriendRequest = (id: string) => {
    return prisma.friendRequest.delete({
        where: { id },
    });
};

export const getReceivedFriendRequests = (userId: number) => {
    return prisma.friendRequest.findMany({
        where: {
            receiverId: userId,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    photo: true,
                },
            },
        },
    });
};

export const getSentFriendRequests = (userId: number) => {
    return prisma.friendRequest.findMany({
        where: {
            senderId: userId,
        },
        include: {
            receiver: {
                select: {
                    id: true,
                    name: true,
                    photo: true,
                },
            },
        },
    });
};

export const getConnections = (userId: number) => {
    return prisma.friendship.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            createdAt: true,
            friend: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    photo: true,
                    lastSeen: true,
                    countryCode: true,
                    city: true,
                    userLanguages: {
                        select: {
                            languageCode: true,
                            isLearning: true,
                            isSpeaking: true,
                        },
                    },
                },
            },
        },
    });
};

export const checkExistingFriendRequest = (
    senderId: number,
    receiverId: number,
) => {
    return prisma.friendRequest.findFirst({
        where: {
            OR: [
                {
                    senderId: senderId,
                    receiverId: receiverId,
                },
                {
                    senderId: receiverId,
                    receiverId: senderId,
                },
            ],
        },
    });
};

export const findReceivedFriendRequest = (
    userId: number,
    requestId: string,
) => {
    return prisma.friendRequest.findFirst({
        where: {
            receiverId: userId,
            id: requestId,
        },
    });
};

export const getFriendRequestById = (id: string) => {
    return prisma.friendRequest.findUnique({
        where: {
            id,
        },
    });
};
