import type { NewMessageInput } from "@linguachat/shared";
import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import {
    getGroupChatMessagesRepo,
    getChatParticipant,
    getDirectChatMessagesRepo,
    getUserChats,
} from "../repositories/chats.repository";
import AppError from "../utils/AppError";
import prisma from "../config/prisma";
import type { MessageStatusType } from "../generated/prisma/client";

export const getUserChatsService = async (
    userId: number,
): Promise<ChatItem[]> => {
    const chatParticipants = await getUserChats(userId);

    return chatParticipants.map(({ chat, unreadCount }) => {
        const otherParticipant = chat.participants[0]?.user;
        const isGroup = chat.type === "Group";
        const lastMessage = chat.lastMessage!;
        return {
            id: chat.id,
            type: chat.type,
            name: isGroup ? chat.name! : otherParticipant?.name!,
            photo: isGroup ? chat.photo! : otherParticipant?.photo!,
            lastMessage: {
                content: lastMessage.content,
                created_at: lastMessage.createdAt.toISOString(),
                sender: {
                    id: lastMessage.sender.id,
                    name: lastMessage.sender.name!,
                },
                statuses: lastMessage.statuses,
            },
            unreadCount,
        };
    });
};

export const getChatMessagesService = async (
    chatId: string,
    userId: number,
    page: number,
    limit: number,
): Promise<ChatMessagesResponse> => {
    const ChatParticipant = await getChatParticipant(chatId, userId);
    if (!ChatParticipant) {
        throw new AppError("User doesn't have chat access.", 403);
    }

    if (ChatParticipant.chat.type === "Group") {
        const groupMessages = await getGroupChatMessagesRepo(
            chatId,
            page,
            limit,
        );
        const messages = groupMessages.map((message) => ({
            ...message,
            client_id: null,
            sender: {
                ...message.sender,
                name: message.sender.name ?? "Unknown",
                photo: message.sender.photo ?? "",
            },
        }));

        return { type: "Group", messages };
    }

    {
        const directMessages = await getDirectChatMessagesRepo(
            chatId,
            page,
            limit,
        );

        const messages = directMessages.map(({ statuses, ...message }) => ({
            ...message,
            client_id: null,
            recieverId: null,
            status: statuses[0]?.status ?? "UnDelivered",
        }));

        return { type: "Direct", messages };
    }
};

type RecipientMessageState = {
    userId: number;
    status: MessageStatusType;
    incrementUnreadCount: boolean;
};

export const createMessageService = async (
    message: NewMessageInput,
    userId: number,
    recipientStates: RecipientMessageState[],
) => {
    return prisma.$transaction(async (tx) => {
        const createdMessage = await tx.message.create({
            data: {
                chatId: message.chatId,
                senderId: userId,
                content: message.content,
            },
            select: {
                id: true,
                chatId: true,
                content: true,
                createdAt: true,
                senderId: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                    },
                },
            },
        });

        await tx.chat.update({
            where: {
                id: message.chatId,
            },
            data: {
                lastMessageId: createdMessage.id,
            },
        });

        if (recipientStates.length > 0) {
            await tx.messageStatus.createMany({
                data: recipientStates.map(
                    ({ userId: recipientId, status }) => ({
                        messageId: createdMessage.id,
                        userId: recipientId,
                        status,
                    }),
                ),
            });
        }

        for (const {
            userId: recipientId,
            incrementUnreadCount,
        } of recipientStates) {
            if (!incrementUnreadCount) continue;

            await tx.chatParticipant.update({
                where: {
                    chatId_userId: {
                        chatId: message.chatId,
                        userId: recipientId,
                    },
                },
                data: {
                    unreadCount: {
                        increment: 1,
                    },
                },
            });
        }

        return createdMessage;
    });
};

import {
    resetChatUnreadCount,
    markMessagesRead,
} from "../repositories/chats.repository";

export const openChatService = async (chatId: string, userId: number) => {
    return prisma.$transaction(async (tx) => {
        await resetChatUnreadCount(tx, chatId, userId);

        await markMessagesRead(tx, chatId, userId);
    });
};
