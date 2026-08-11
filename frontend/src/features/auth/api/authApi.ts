import type { SignupInput } from "@linguachat/shared"
import api from "../../../lib/api"

export const signup = async (data: SignupInput) => {
    const res = await api.post("/signup", data);
    return res.data;
}