import { NextFunction, Request, Response } from "express";
import type {} from "../types/express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/env";
import { findUserById } from "../repositories/user.repository";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const getCookie = (cookieHeader: string | undefined, name: string) => {
    if (!cookieHeader) return undefined;

    return cookieHeader
        .split(";")
        .map((cookie) => cookie.trim().split("="))
        .find(([cookieName]) => cookieName === name)
        ?.slice(1)
        .join("=");
};

export const verifyClientOrigin = (origin: string | undefined) => {
    const isDevelopment = ["development", "developement", "dev"].includes(
        process.env.NODE_ENV?.toLowerCase() ?? "",
    );

    if (!isDevelopment && (!origin || origin !== config.clientOrigin)) {
        throw new AppError("Unauthorized request origin", 403);
    }
};

export const authenticateFromCookie = async (
    cookieHeader: string | undefined,
) => {
    const token = getCookie(cookieHeader, "token");

    if (!token) {
        throw new AppError(
            "You are not logged in. Please log in to get access.",
            401,
        );
    }

    let decoded: JwtPayload;

    try {
        const verifiedToken = jwt.verify(token, config.JWTSecretKey);

        if (
            typeof verifiedToken === "string" ||
            typeof verifiedToken.id !== "number"
        ) {
            throw new AppError("Invalid authentication token", 401);
        }

        decoded = verifiedToken;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            "Your token is invalid or has expired. Please log in again.",
            401,
        );
    }

    const user = await findUserById(decoded.id);

    if (!user) {
        throw new AppError(
            "The user belonging to this token no longer exists.",
            401,
        );
    }

    if (
        user.passwordChangedAt &&
        (!decoded.iat || decoded.iat * 1000 <= user.passwordChangedAt.getTime())
    ) {
        throw new AppError(
            "Your password was changed. Please log in again.",
            401,
        );
    }

    const { passwordChangedAt: _passwordChangedAt, ...safeUser } = user;

    return safeUser;
};

export const protect = catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
        const origin = req.get("origin");
        verifyClientOrigin(origin);
        
        const cookie = req.headers.cookie;
        const safeUser = await authenticateFromCookie(cookie);

        req.user = safeUser;
        next();
    },
);
