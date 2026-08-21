import type {} from "../types/express";
import {
    getChatMessagesService,
    getUserChatsService,
} from "../services/chats.service";
import catchAsync from "../utils/catchAsync";

export const getUserChats = catchAsync(async (req, res) => {
    const userId: number = req.user?.id || 0; //Can't be 0 won't pass protect middleware
    const chats = await getUserChatsService(userId);

    res.status(200).json({ status: "success", data: chats });
});

export const getChatMessages = catchAsync(async (req, res) => {
    const userId = req.user?.id || 0;
    const chatId = req.params.id;
    const { page, limit } = req.query;
    const messages = await getChatMessagesService(
        chatId,
        userId,
        Number(page),
        Number(limit),
    );
    
    res.status(200).json({status: "success", data: messages});
});
