import { Server, Socket } from "socket.io";

import {
    getChatParticipant,
    getChatParticipants,
    getUserChatsIds,
    markUndeliveredMessagesDelivered,
} from "../../repositories/chats.repository";
import {
    CHAT_EVENTS,
    type DirectMessage,
    type GroupMessage,
    newMessageInputSchema,
    openChatInputSchema,
} from "@linguachat/shared";
import type { OpenChatInput } from "@linguachat/shared";
import {
    createMessageService,
    openChatService,
} from "../../services/chats.service";
import { redis } from "../../config/redis";
import { redisKeys } from "../../redis/keys";
import type { MessageStatusType } from "../../generated/prisma/client";

const userRoom = (userId: number) => `user:${userId}`;
const chatRoom = (chatId: string) => `chat:${chatId}`;

const emitToDirectChatParticipants = (
    io: Server,
    participants: { userId: number }[],
    event: string,
    payload: unknown,
) => {
    for (const { userId } of participants) {
        io.to(userRoom(userId)).emit(event, payload);
    }
};

export const newMessageHandler = async (
    io: Server,
    socket: Socket,
    data: unknown,
) => {
    const parsedData = newMessageInputSchema.safeParse(data);
    if (!parsedData.success) return;

    const userId = socket.data.user.id;

    const chatParticipant = await getChatParticipant(
        parsedData.data.chatId,
        userId,
    );
    if (!chatParticipant) return;

    const participants = await getChatParticipants(parsedData.data.chatId);

    const recipientStates = await Promise.all(
        participants
            .filter((participant) => participant.userId !== userId)
            .map(async ({ userId: participantId }) => {
                const socketIds = await redis.smembers(
                    redisKeys.userSockets(participantId),
                );
                const openChatIds = socketIds.length
                    ? await redis.mget(
                          socketIds.map((socketId) =>
                              redisKeys.socketOpenChat(participantId, socketId),
                          ),
                      )
                    : [];
                const hasChatOpen = openChatIds.some(
                    (openChatId) => openChatId === parsedData.data.chatId,
                );
                const status: MessageStatusType = hasChatOpen
                    ? "Read"
                    : socketIds.length > 0
                      ? "Delivered"
                      : "UnDelivered";

                return {
                    userId: participantId,
                    status,
                    incrementUnreadCount: !hasChatOpen,
                };
            }),
    );

    console.log(recipientStates);

    const message = await createMessageService(
        parsedData.data,
        userId,
        recipientStates,
    );

    const emittedMessage: DirectMessage | GroupMessage =
        chatParticipant.chat.type === "Group"
            ? {
                  ...message,
                  client_id: parsedData.data.id,
                  statuses: recipientStates.map(({ userId, status }) => ({
                      userId,
                      status,
                      updatedAt: message.createdAt,
                  })),
              }
            : {
                  id: message.id,
                  client_id: parsedData.data.id,
                  chatId: message.chatId,
                  content: message.content,
                  createdAt: message.createdAt,
                  senderId: message.senderId,
                  recieverId: recipientStates[0]?.userId,
                  status: recipientStates[0]?.status ?? "UnDelivered",
              };

    if (chatParticipant.chat.type === "Group") {
        io.to(chatRoom(parsedData.data.chatId)).emit(
            CHAT_EVENTS.NEW_MESSAGE,
            emittedMessage,
        );
    } else {
        emitToDirectChatParticipants(
            io,
            participants,
            CHAT_EVENTS.NEW_MESSAGE,
            emittedMessage,
        );
    }
};

export const openChatHandler = async (
    socket: Socket,
    io: Server,
    data: unknown,
) => {
    const parsedData = openChatInputSchema.safeParse(data);
    if (!parsedData.success) return;

    const userId = socket.data.user.id;

    const participant = await getChatParticipant(
        parsedData.data.chatId,
        userId,
    );

    if (!participant) {
        return;
    }

    await redis.set(
        redisKeys.socketOpenChat(userId, socket.id),
        parsedData.data.chatId,
    );

    if (participant.unreadCount > 0) {
        await openChatService(parsedData.data.chatId, userId);

        const payload = {
            chatId: parsedData.data.chatId,
            userId,
        };

        if (participant.chat.type === "Group") {
            socket.to(chatRoom(parsedData.data.chatId)).emit(
                CHAT_EVENTS.OPEN_CHAT,
                payload,
            );
        } else {
            const participants = await getChatParticipants(
                parsedData.data.chatId,
            );
            for (const { userId: participantId } of participants) {
                if (participantId !== userId) {
                    io.to(userRoom(participantId)).emit(
                        CHAT_EVENTS.OPEN_CHAT,
                        payload,
                    );
                }
            }
        }
    }
};

export const closeChatHandler = async (
    socket: Socket,
    _data: OpenChatInput,
) => {
    const userId = socket.data.user.id;
    await redis.del(redisKeys.socketOpenChat(userId, socket.id));
};

export const chatsJoiningHandler = async (socket: Socket, io: Server) => {
    const userId = socket.data.user.id;

    socket.join(userRoom(userId));

    const chats = await getUserChatsIds(userId);
    for (const chat of chats) {
        if (chat.chat.type === "Group") {
            socket.join(chatRoom(chat.chatId));
        }
    }

    const deliveredChatIds = await markUndeliveredMessagesDelivered(userId);
    for (const chatId of deliveredChatIds) {
        const participant = await getChatParticipant(chatId, userId);
        if (!participant) continue;

        const payload = { chatId, userId };

        if (participant.chat.type === "Group") {
            socket.to(chatRoom(chatId)).emit(
                CHAT_EVENTS.MESSAGES_DELIVERED,
                payload,
            );
        } else {
            const participants = await getChatParticipants(chatId);
            for (const { userId: participantId } of participants) {
                if (participantId !== userId) {
                    io.to(userRoom(participantId)).emit(
                        CHAT_EVENTS.MESSAGES_DELIVERED,
                        payload,
                    );
                }
            }
        }
    }
};
