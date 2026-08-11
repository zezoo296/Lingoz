import type { SignupInput, LoginInput } from "@linguachat/shared"
import api from "../../../lib/api"

export const signup = async (data: SignupInput) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
}

export const login = async (data: LoginInput) => {
    const res = await api.post("/auth/login", data);
    return res.data;
}