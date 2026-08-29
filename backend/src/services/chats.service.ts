import {
    getChatMessageForUser,
    getLastChatMessages,
    toggleChatFavouritesRepo,
} from "./../repositories/chats.repository";
import type { NewMessageInput } from "@linguachat/shared";
import type { ChatItem, ChatMessagesResponse } from "@linguachat/shared";
import { getFriendship } from "../repositories/friends.repository";
import { getUserBasicInfo } from "../repositories/user.repository";
import {
    getGroupChatMessagesRepo,
    getChatParticipant,
    getDirectChatMessagesRepo,
    getUserChats,
    createDirectChat,
    findDirectChatBetweenUsers,
} from "../repositories/chats.repository";
import AppError from "../utils/AppError";
import prisma from "../config/prisma";
import type { MessageStatusType } from "../generated/prisma/client";
import { decodeCursor } from "../utils/cursor";
import { gemini } from "../config/geminiAI";

const getDisplayName = (
    user: { username?: string | null; name?: string | null } | undefined,
    fallback = "Unknown user",
) => user?.username ?? user?.name ?? fallback;

export const getUserChatsService = async (
    userId: number,
): Promise<ChatItem[]> => {
    const chatParticipants = await getUserChats(userId);

    return chatParticipants.map(({ chat, unreadCount }) => {
        const otherParticipant = chat.participants[0]?.user;
        const isGroup = chat.type === "Group";
        const lastMessage = chat.lastMessage ?? {
            id: `empty-${chat.id}`,
            content: "No messages yet",
            createdAt: chat.createdAt,
            sender: { id: userId, name: "" },
            statuses: [],
        };
        return {
            id: chat.id,
            type: chat.type,
            isFavourite: chat.isFavourite,
            name: isGroup
                ? (chat.name ?? "Unnamed group")
                : getDisplayName(otherParticipant),
            photo: isGroup
                ? (chat.photo ?? "")
                : (otherParticipant?.photo ?? ""),
            lastMessage: {
                id: lastMessage.id,
                content: lastMessage.content,
                created_at: lastMessage.createdAt.toISOString(),
                sender: {
                    id: lastMessage.sender.id,
                    name: getDisplayName(lastMessage.sender),
                },
                statuses: lastMessage.statuses,
                suggestions: null,
            },
            unreadCount,
        };
    });
};

export const getOrCreateDirectChatService = async (
    userId: number,
    recipientId: number,
): Promise<ChatItem | string> => {
    if (userId === recipientId) {
        throw new AppError("You cannot create a chat with yourself", 400);
    }

    const connection = await getFriendship(userId, recipientId);
    if (!connection) {
        throw new AppError("You can only message your connections", 403);
    }

    const existingChat = await findDirectChatBetweenUsers(userId, recipientId);

    let chatId: string;
    if (existingChat) {
        if (existingChat.chat.lastMessageId) return existingChat.chatId;
        chatId = existingChat.chatId;
    } else {
        chatId = (await createDirectChat(userId, recipientId)).id;
    }

    const recipient = await getUserBasicInfo(recipientId);

    if (!recipient) {
        throw new AppError("Unable to create a direct chat", 500);
    }

    return {
        id: chatId,
        type: "Direct",
        isFavourite: false,
        name: getDisplayName(recipient),
        photo: recipient.photo ?? "",
        lastMessage: {
            id: "",
            content: "",
            created_at: new Date().toISOString(),
            sender: { id: userId, name: getDisplayName(recipient) },
            statuses: [],
            suggestions: null,
        },
        unreadCount: 0,
    };
};

export const getChatMessagesService = async (
    chatId: string,
    userId: number,
    cursor: string | undefined,
    limit: number,
): Promise<ChatMessagesResponse> => {
    const ChatParticipant = await getChatParticipant(chatId, userId);
    if (!ChatParticipant) {
        throw new AppError("User doesn't have chat access.", 403);
    }

    const decodedCursor = cursor ? decodeCursor(cursor) : undefined;

    if (ChatParticipant.chat.type === "Group") {
        const { messages: groupMessages, nextCursor } =
            await getGroupChatMessagesRepo(chatId, decodedCursor, limit);
        const messages = groupMessages.map((message) => ({
            ...message,
            client_id: null,
            sender: {
                ...message.sender,
                name: message.sender.name ?? "Unknown",
                photo: message.sender.photo ?? "",
            },
            suggestions: null,
        }));

        return { type: "Group", messages, nextCursor };
    }

    {
        const { messages: directMessages, nextCursor } =
            await getDirectChatMessagesRepo(chatId, decodedCursor, limit);

        const messages = directMessages.map(({ statuses, ...message }) => ({
            ...message,
            client_id: null,
            recieverId: null,
            status: statuses[0]?.status ?? "UnDelivered",
            suggestions: null,
        }));

        return { type: "Direct", messages, nextCursor };
    }
};

type RecipientMessageState = {
    userId: number;
    status: MessageStatusType;
    incrementUnreadCount: boolean;
};

export const createMessageService = async (
    //must be called from inside socket after making sure user belongs to chat
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

export const toggleChatFavouritesService = async (
    chatId: string,
    userId: number,
) => {
    const ChatParticipant = await getChatParticipant(chatId, userId);
    if (!ChatParticipant) {
        throw new AppError("User doesn't have chat access.", 403);
    }
    await toggleChatFavouritesRepo(chatId);
};

import { messageSuggestionsSchema } from "@linguachat/shared/src/schemas/chat.schema";
import { updateMessageSuggestions } from "./../repositories/chats.repository";

export const getMessageSuggestionsService = async (
    messageId: string,
    userId: number,
) => {
    const message = await getChatMessageForUser(messageId, userId);

    if (!message) {
        throw new AppError("Message not found", 404);
    }

    if (message.chat.participants.length === 0) {
        throw new AppError("User is not a participant in this chat", 403);
    }

    if (message.senderId === userId) {
        throw new AppError(
            "Cannot generate suggestions for your own message",
            400,
        );
    }

    if (message.suggestions) return message.suggestions;

    const lastMessages = await getLastChatMessages(message.chatId);

    const conversation = lastMessages
        .reverse()
        .map((msg) => {
            const sender = msg.senderId === userId ? "User" : "Other";
            return `${sender}: ${msg.content}`;
        })
        .join("\n");

    const prompt = `
        Generate 3 short, natural reply suggestions for the user.

        Conversation:
        ${conversation}

        The last message is from "Other", and the user needs possible replies.

        Requirements:
        - Generate exactly 3 suggestions.
        - Keep them short and natural.
        - Make them meaningfully different.
        - Match the language of the conversation.
        - Do not include explanations.
        - Return only a JSON object in this format:
        {
        "suggestions": ["...", "...", "..."]
        }
    `;

    const response = await gemini.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    const text = response.text;

    if (!text) {
        throw new AppError("Gemini returned an empty response", 500);
    }

    const parsed = JSON.parse(text);

    const result = messageSuggestionsSchema.safeParse(parsed);

    if (!result.success) {
        throw new AppError("Invalid suggestions returned by Gemini", 500);
    }

    await updateMessageSuggestions(message.id, result.data.suggestions);

    return result.data.suggestions;
};
