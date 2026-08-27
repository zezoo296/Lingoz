import type {} from "../types/express";
import {
    toggleChatFavouritesService,
    getChatMessagesService,
    getUserChatsService,
    getMessageSuggestionsService,
    getOrCreateDirectChatService,
} from "../services/chats.service";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export const getUserChats = catchAsync(async (req, res) => {
    const userId: number = req.user?.id || 0; //Can't be 0 won't pass protect middleware
    const chats = await getUserChatsService(userId);

    res.status(200).json({ status: "success", data: chats });
});

export const getOrCreateDirectChat = catchAsync(async (req, res) => {
    const userId = req.user?.id || 0;
    const recipientId = Number(req.params.recipientId);
    if (!Number.isInteger(recipientId) || recipientId <= 0) {
        throw new AppError("Recipient ID must be a positive integer", 400);
    }

    const chat = await getOrCreateDirectChatService(userId, recipientId);
    res.status(200).json({ status: "success", data: chat });
});

export const getChatMessages = catchAsync(async (req, res) => {
    const userId = req.user?.id || 0;
    const chatId = req.params.id;
    const cursor =
        typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    const limit = Number(req.query.limit) || 20;
    const messages = await getChatMessagesService(
        chatId,
        userId,
        cursor,
        limit,
    );

    res.status(200).json({ status: "success", data: messages });
});

export const toggleChatFavourites = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const chatId = req.params.id;
    if (!userId || !chatId) throw new AppError("Incomplete params", 400);

    await toggleChatFavouritesService(chatId, userId);

    res.status(200).json({ status: "succcess" });
});

export const getMessageSuggestions = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const messageId = req.body.messageId;
    if (!userId || !messageId) throw new AppError("Incomplete params", 400);

    const suggestions = await getMessageSuggestionsService(messageId, userId);

    res.status(200).json({
        status: "successs",
        data: suggestions,
    });
});
