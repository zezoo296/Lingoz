import type { UpdateFriendRequestInput } from "@linguachat/shared";
import api from "../../../lib/api";

export type FriendRequestUser = {
    id: number;
    name: string | null;
    username: string | null;
    photo: string | null;
    lastSeen: string | null;
    countryCode: string | null;
    city: string | null;
    userLanguages: Array<{
        languageCode: string;
        isLearning: boolean;
        isSpeaking: boolean;
    }>;
};

export type FriendRequest = {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    sender?: FriendRequestUser;
    receiver?: FriendRequestUser;
};

export type Connection = {
    createdAt: string;
    friend: {
        id: number;
        name: string | null;
        username: string | null;
        photo: string | null;
        lastSeen: string | null;
        countryCode: string | null;
        city: string | null;
        userLanguages: Array<{
            languageCode: string;
            isLearning: boolean;
            isSpeaking: boolean;
        }>;
    };
};

export const connect = async (receiverId: number) => {
    const response = await api.post("/friendships/requests", {
        receiverId: receiverId,
    });
    return response.data;
};

export const unfriend = async (receiverId: number) => {
    const response = await api.delete(`/friendships/${receiverId}`);
    return response.data;
};

export const getReceivedRequests = async (): Promise<FriendRequest[]> => {
    const response = await api.get("/friendships/requests/received");
    return response.data.data;
};

export const getSentRequests = async (): Promise<FriendRequest[]> => {
    const response = await api.get("/friendships/requests/sent");
    return response.data.data;
};

export const getConnections = async (): Promise<Connection[]> => {
    const response = await api.get("/friendships/connections");
    return response.data.data;
};

export const respondToRequest = async (
    status: UpdateFriendRequestInput,
    requestId: string,
) => {
    const response = await api.patch(
        `/friendships/requests/${requestId}`,
        status,
    );
    return response.data;
};

export const cancelRequest = async (requestId: string) => {
    const response = await api.delete(`/friendships/requests/${requestId}`);
    return response.data;
};
