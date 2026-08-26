import type { UpdateFriendRequestInput } from "@linguachat/shared";
import api from "../../../lib/api";

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

export const getRecievedRequests = async () => {
    const response = await api.get("/friendships/requests/received");
    return response.data;
};

export const getSentRequests = async () => {
    const response = await api.get("/friendships/requests/sent");
    return response.data;
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
