import api from "../../../lib/api";
import {
    discoveryUsersResponseSchema,
    type DiscoveryUsersResponse,
    type UserQueryParams,
} from "@linguachat/shared";

export const getUsers = async (
    queryParams: UserQueryParams,
    limit: number = 20,
    cursor: string | null = null,
): Promise<DiscoveryUsersResponse> => {
    const response = await api.get("/users", {
        params: {
            limit,
            ...queryParams,
            ...(cursor ? { cursor } : {}),
        },
    });

    return discoveryUsersResponseSchema.parse(response.data.data);
};


