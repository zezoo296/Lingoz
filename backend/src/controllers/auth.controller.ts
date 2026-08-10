import { Request, Response } from "express";
import signupService from "../services/auth.service";
import catchAsync from "../utils/catchAsync";

export const signup = catchAsync(
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const result = await signupService({ name, email, password });

        res.status(201).json({
            status: "success",
            message: result.message,
            data: result.user,
        });
    },
);
