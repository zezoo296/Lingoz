import { Request, Response } from "express";
import type {} from "../types/express";
import { signupService, loginService } from "../services/auth.service";
import catchAsync from "../utils/catchAsync";

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

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        status: "success",
        message: result.message,
        user: result.user,
    });
});

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
        data: req.user,
    });
};
