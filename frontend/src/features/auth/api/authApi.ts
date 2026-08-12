import type {
    SignupInput,
    LoginInput,
    ForgotPasswordInput,
    VerifyResetOtpInput,
    ResetPasswordInput,
} from "@linguachat/shared";
import api from "../../../lib/api";

export const signup = async (data: SignupInput) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
};

export const login = async (data: LoginInput) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const googleLogin = async (token: string) => {
    const res = await api.post("/auth/google/token", { token });
    return res.data;
};

export const forgotPassword = async (data: ForgotPasswordInput) => {
    const res = await api.post("/auth/forgot-password", data);
    return res.data;
};

export const verifyResetOtp = async (data: VerifyResetOtpInput) => {
    const res = await api.post("/auth/verify-reset-otp", data);
    return res.data;
};

export const resetPassword = async (data: ResetPasswordInput) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
};
