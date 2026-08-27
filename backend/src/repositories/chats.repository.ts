import { Prisma } from "@prisma/client/extension";
import prisma from "../config/prisma";
import { encodeCursor, type Cursor, olderThanCursor } from "../utils/cursor";


const paginateMessages = <T extends { id: string; createdAt: Date }>(
    rows: T[],
    limit: number,
) => {
    const hasMore = rows.length > limit;
    const messages = hasMore ? rows.slice(0, limit) : rows;
    const lastMessage = messages[messages.length - 1];
    const nextCursor =
        hasMore && lastMessage
            ? encodeCursor({
                  createdAt: lastMessage.createdAt,
                  id: lastMessage.id,
              })
            : null;

    return { messages, nextCursor };
};

export const getUserChatsIds = (userId: number) => {
    return prisma.chatParticipant.findMany({
        where: {
            userId: userId,
        },
        select: {
            chatId: true,
            chat: {
                select: {
                    type: true,
                },
            },
        },
    });
};

export const getUserChats = (userId: number) => {
    return prisma.chatParticipant.findMany({
        where: {
            userId,
        },
        select: {
            unreadCount: true,
            chat: {
                select: {
                    id: true,
                    createdAt: true,
                    type: true,
                    name: true,
                    photo: true,
                    isFavourite: true,
                    participants: {
                        where: {
                            userId: {
                                not: userId,
                            },
                        },
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    photo: true,
                                },
                            },
                        },
                    },
                    lastMessage: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            sender: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            statuses: {
                                where: {
                                    userId: {
                                        not: userId,
                                    },
                                },
                                select: {
                                    userId: true,
                                    status: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};

export const findDirectChatBetweenUsers = (
    userId: number,
    recipientId: number,
) => {
    return prisma.chatParticipant.findFirst({
        where: {
            userId,
            chat: {
                type: "Direct",
                participants: { some: { userId: recipientId } },
            },
        },
        select: { chatId: true },
    });
};

export const createDirectChat = (userId: number, recipientId: number) => {
    return prisma.chat.create({
        data: {
            type: "Direct",
            participants: {
                create: [{ userId }, { userId: recipientId }],
            },
        },
        select: { id: true },
    });
};

export const getDirectChatDetails = (chatId: string, userId: number) => {
    return prisma.chat.findUnique({
        where: { id: chatId },
        select: {
            id: true,
            type: true,
            isFavourite: true,
            participants: {
                where: { userId: { not: userId } },
                select: {
                    user: { select: { id: true, name: true, photo: true } },
                },
            },
        },
    });
};

export const getChatParticipant = (chatId: string, userId: number) => {
    return prisma.chatParticipant.findFirst({
        where: {
            chatId: chatId,
            userId: userId,
        },
        select: {
            unreadCount: true,
            chat: {
                select: {
                    type: true,
                },
            },
        },
    });
};

export const getChatParticipants = (chatId: string) => {
    return prisma.chatParticipant.findMany({
        where: {
            chatId,
        },
        select: {
            userId: true,
        },
    });
};

export const getGroupChatMessagesRepo = async (
    chatId: string,
    cursor?: Cursor,
    limit: number = 20,
) => {
    const rows = await prisma.message.findMany({
        where: {
            chatId: chatId,
            ...(cursor ? olderThanCursor(cursor) : {}),
        },
        select: {
            id: true,
            chatId: true,
            content: true,
            createdAt: true,
            sender: {
                select: {
                    id: true,
                    name: true,
                    photo: true,
                },
            },
            statuses: {
                select: {
                    userId: true,
                    status: true,
                    updatedAt: true,
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

    return paginateMessages(rows, limit);
};

export const getDirectChatMessagesRepo = async (
    chatId: string,
    cursor?: Cursor,
    limit: number = 20,
) => {
    const rows = await prisma.message.findMany({
        where: {
            chatId,
            ...(cursor ? olderThanCursor(cursor) : {}),
        },
        select: {
            id: true,
            chatId: true,
            content: true,
            createdAt: true,
            senderId: true,
            statuses: {
                select: {
                    status: true,
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

    return paginateMessages(rows, limit);
};

export const resetChatUnreadCount = async (
    tx: Prisma.TransactionClient,
    chatId: string,
    userId: number,
) => {
    return tx.chatParticipant.update({
        where: {
            chatId_userId: {
                chatId,
                userId,
            },
        },
        data: {
            unreadCount: 0,
        },
    });
};

export const markMessagesRead = async (
    tx: Prisma.TransactionClient,
    chatId: string,
    userId: number,
) => {
    return tx.messageStatus.updateMany({
        where: {
            userId,
            status: {
                not: "Read",
            },
            message: {
                chatId,
            },
        },
        data: {
            status: "Read",
        },
    });
};

export const markUndeliveredMessagesDelivered = async (userId: number) => {
    return prisma.$transaction(async (tx) => {
        const statuses = await tx.messageStatus.findMany({
            where: {
                userId,
                status: "UnDelivered",
            },
            select: {
                message: {
                    select: {
                        chatId: true,
                    },
                },
            },
        });

        if (statuses.length === 0) return [];

        await tx.messageStatus.updateMany({
            where: {
                userId,
                status: "UnDelivered",
            },
            data: {
                status: "Delivered",
            },
        });

        return [...new Set(statuses.map((status) => status.message.chatId))];
    });
};

export const toggleChatFavouritesRepo = (chatId: string) => {
    return prisma.$executeRaw`
        UPDATE "Chat" 
        SET "isFavourite" = NOT "isFavourite" 
        WHERE "id" = ${chatId}
    `;
};

export const getChatMessageForUser = (messageId: string, userId: number) => {
    return prisma.message.findUnique({
        where: { id: messageId },
        include: {
            chat: {
                include: {
                    participants: {
                        where: {
                            userId: userId,
                        },
                    },
                },
            },
        },
    });
};

export const getLastChatMessages = (chatId: string) => {
    return prisma.message.findMany({
        where: {
            chatId: chatId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
};

export const updateMessageSuggestions = (
    messageId: string,
    suggestions: string[],
) => {
    return prisma.message.update({
        where: {
            id: messageId,
        },
        data: {
            suggestions: suggestions,
        },
    });
};
