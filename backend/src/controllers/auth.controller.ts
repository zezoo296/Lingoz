import { Request, Response } from "express";
import type {} from "../types/express";
import AppError from "../utils/AppError";
import {
    signupService,
    loginService,
    googleLoginService,
    forgotPasswordService,
    verifyResetOtpService,
    resetPasswordService,
} from "../services/auth.service";
import catchAsync from "../utils/catchAsync";
import { userSchema } from "@linguachat/shared";

export const signup = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const result = await signupService({ name, email, password });

    res.status(201).json({
        status: "success",
        message: result.message,
        data: result.user,
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    const isProdcution = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: isProdcution,
        sameSite: isProdcution ? "none" : "lax",
    });

    res.status(200).json({
        status: "success",
        message: result.message,
        user: result.user,
    });
});

export const loginWithGoogle = catchAsync(
    async (req: Request, res: Response) => {
        const { token } = req.body;

        if (!token || typeof token !== "string") {
            throw new AppError("Google token is required", 400);
        }

        const result = await googleLoginService(token);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
            status: "success",
            message: result.message,
            user: result.user,
        });
    },
);

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};

export const getCurrentUser = (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        data: userSchema.parse(req.user),
    });
};

export const forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const result = await forgotPasswordService(email);

        res.status(200).json({
            status: "success",
            message: result.message,
        });
    },
);

export const verifyResetOtp = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;

        const result = await verifyResetOtpService({ email, otp });

        res.status(200).json({
            status: "success",
            message: result.message,
            data: {
                resetToken: result.resetToken,
            },
        });
    },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { resetToken, password } = req.body;

    const result = await resetPasswordService({ resetToken, password });

    res.status(200).json({
        status: "success",
        message: result.message,
    });
});
