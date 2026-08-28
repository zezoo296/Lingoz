import api from "../../../lib/api";
import {
    updateUserLanguagesSchema,
    userProfileSchema,
    type UpdateUserLanguagesInput,
} from "@linguachat/shared";

export const getMe = async () => {
    const res = await api.get("/users/me");
    const parsed = userProfileSchema.safeParse(res.data.data);

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }

    return parsed.data;
};

export const updateMe = async (data: FormData) => {
    const res = await api.patch("/users/me", data);
    const parsed = userProfileSchema.safeParse(res.data.data);

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }

    return parsed.data;
};

export const updateUserLanguages = async (data: UpdateUserLanguagesInput) => {
    const payload = updateUserLanguagesSchema.parse(data);
    const res = await api.patch("/users/me/languages", payload);
    const parsed = userProfileSchema.safeParse(res.data.data);

    if (!parsed.success) {
        throw new Error(parsed.error.message);
    }

    return parsed.data;
};
