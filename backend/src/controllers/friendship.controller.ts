import { Request, Response } from "express";
import type {} from "../types/express";
import type { FriendRequestStatus } from "../generated/prisma/client";
import {
    cancelFriendRequestService,
    getReceivedFriendRequestsService,
    getSentFriendRequestsService,
    removeFriendshipService,
    respondToFriendRequestService,
    sendFriendRequestService,
} from "../services/friendship.service";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const authenticatedUserId = (req: Request) => {
    if (!req.user) throw new AppError("Authentication is required", 401);
    return req.user.id;
};

const positiveIdParam = (value: string, name: string) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(`${name} must be a positive integer`, 400);
    }
    return id;
};

export const sendFriendRequest = catchAsync(async (req, res) => {
    const result = await sendFriendRequestService(
        authenticatedUserId(req),
        req.body.receiverId,
    );

    res.status(201).json({ status: "success", data: result.request });
});

export const getReceivedFriendRequests = catchAsync(async (req, res) => {
    const requests = await getReceivedFriendRequestsService(
        authenticatedUserId(req),
    );
    res.status(200).json({ status: "success", data: requests });
});

export const getSentFriendRequests = catchAsync(async (req, res) => {
    const requests = await getSentFriendRequestsService(
        authenticatedUserId(req),
    );
    res.status(200).json({ status: "success", data: requests });
});

export const respondToFriendRequest = catchAsync(async (req, res) => {
    await respondToFriendRequestService(
        authenticatedUserId(req),
        req.params.requestId,
        req.body.status as Extract<
            FriendRequestStatus,
            "APPROVED" | "REJECTED"
        >,
    );

    res.status(200).json({
        status: "success",
        message: "Friend request response recorded.",
    });
});

export const cancelFriendRequest = catchAsync(async (req, res) => {
    await cancelFriendRequestService(
        authenticatedUserId(req),
        req.params.requestId,
    );
    res.status(204).send();
});

export const removeFriendship = catchAsync(async (req, res) => {
    await removeFriendshipService(
        authenticatedUserId(req),
        positiveIdParam(req.params.friendId, "Friend ID"),
    );
    res.status(204).send();
});
