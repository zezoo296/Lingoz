import type { FriendRequestStatus } from "../generated/prisma/client";
import {
    checkExistingFriendRequest,
    findReceivedFriendRequest,
    createFriendRequest,
    approveFriendRequest,
    deleteFriendRequest,
    getReceivedFriendRequests,
    getSentFriendRequests,
    removeFriendship,
    updateFriendRequestStatus,
    getFriendRequestById,
    getConnectionsRepo,
} from "../repositories/friends.repository";
import { findUserById } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import { Prisma } from "../generated/prisma/client";

export const sendFriendRequestService = async (
    senderId: number,
    receiverId: number,
) => {
    if (senderId === receiverId) {
        throw new AppError("You cannot send a friend request to yourself", 400);
    }

    const receiver = await findUserById(receiverId);
    if (!receiver || receiver.isDeleted) {
        throw new AppError("User not found", 404);
    }

    const existingRequest = await checkExistingFriendRequest(
        senderId,
        receiverId,
    );
    if (existingRequest) {
        if (existingRequest.status === "PENDING") {
            throw new AppError("A pending friend request already exists", 409);
        }

        if (existingRequest.status === "APPROVED") {
            throw new AppError("You are already friends", 409);
        }
        throw new AppError("Friend request already exists", 409);
    }

    const request = await createFriendRequest({ senderId, receiverId });
    return { request };
};

export const getReceivedFriendRequestsService = (userId: number) =>
    getReceivedFriendRequests(userId);

export const getSentFriendRequestsService = (userId: number) =>
    getSentFriendRequests(userId);

export const getConnectionsService = (userId: number) => getConnectionsRepo(userId);

export const respondToFriendRequestService = async (
    userId: number,
    requestId: string,
    status: Extract<FriendRequestStatus, "APPROVED" | "REJECTED">,
) => {
    const request = await findReceivedFriendRequest(userId, requestId);

    if (!request) {
        throw new AppError("Friend request not found", 404);
    }

    if (request.status !== "PENDING") {
        throw new AppError("This friend request has already been handled", 409);
    }

    if (status === "REJECTED") {
        await updateFriendRequestStatus(requestId, status);
        return;
    }

    await approveFriendRequest(request.senderId, request.receiverId, requestId);
};

export const cancelFriendRequestService = async (
    userId: number,
    requestId: string,
) => {
    const request = await getFriendRequestById(requestId);

    if (!request) {
        throw new AppError("Friend request not found", 404);
    }

    if (request?.senderId !== userId) {
        throw new AppError(
            "You are not authorized to cancel this friend request.",
            403,
        );
    }

    if (request.status !== "PENDING") {
        throw new AppError(
            "Only pending friend requests can be cancelled",
            409,
        );
    }

    await deleteFriendRequest(requestId);
};

export const removeFriendshipService = async (
    userId: number,
    friendId: number,
) => {
    if (userId === friendId) {
        throw new AppError("You cannot remove yourself as a friend", 400);
    }

    try {
        await removeFriendship(userId, friendId);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError("Friendship not found", 404);
        }

        throw error;
    }
};
