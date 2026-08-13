import bcrypt from "bcrypt";
import AppError from "../utils/AppError";
import { config } from "../config/env";
import type {
    SignupInput,
    ResetPasswordInput,
    VerifyResetOtpInput,
} from "@linguachat/shared";
import {
    findUserByEmail,
    findByEmailOrGoogleId,
    createUser,
    updateUserGoogleId,
    updateUserPasswordResetOtp,
    updateUserPasswordResetToken,
    updateUserPassword,
    findUserByResetTokenHash,
} from "../repositories/user.repository";
import { signToken } from "../utils/jwt";
import { verifyGoogleToken } from "../utils/google";
import {
    generateOtp,
    generateResetToken,
    hashValue,
    verifyHash,
} from "../utils/crypto";
import { sendPasswordResetOtpEmail } from "../services/email.service";
import { emailQueue } from "../queues/email.queue";

const GENERIC_FORGOT_PASSWORD_MESSAGE =
    "If an account with that email exists, a reset code has been sent.";

const INVALID_OTP_MESSAGE = "Invalid or expired OTP";
const INVALID_RESET_TOKEN_MESSAGE = "Invalid or expired reset token";

export const forgotPasswordService = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (user?.password) {
        const otp = generateOtp();
        const otpHash = hashValue(otp);
        const expiresAt = new Date(
            Date.now() + config.passwordResetOtpExpiresInMs,
        );

        await updateUserPasswordResetOtp(user.id, otpHash, expiresAt);
        await emailQueue.add(
            "password-reset",
            {
                email,
                otp,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: {
                    age: 3600,
                },
            },
        );
    }

    return {
        message: GENERIC_FORGOT_PASSWORD_MESSAGE,
    };
};

export const verifyResetOtpService = async ({
    email,
    otp,
}: VerifyResetOtpInput) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (
        !user?.passwordResetOtpHash ||
        !user.passwordResetOtpExpiresAt ||
        user.passwordResetOtpExpiresAt < new Date() ||
        !verifyHash(otp, user.passwordResetOtpHash)
    ) {
        throw new AppError(INVALID_OTP_MESSAGE, 400);
    }

    const resetToken = generateResetToken();
    const resetTokenHash = hashValue(resetToken);
    const expiresAt = new Date(
        Date.now() + config.passwordResetTokenExpiresInMs,
    );

    await updateUserPasswordResetToken(user.id, resetTokenHash, expiresAt);

    return {
        message: "OTP verified successfully",
        resetToken,
    };
};

export const resetPasswordService = async ({
    resetToken,
    password,
}: ResetPasswordInput) => {
    const resetTokenHash = hashValue(resetToken);
    const user = await findUserByResetTokenHash(resetTokenHash);

    if (
        !user?.passwordResetTokenExpiresAt ||
        user.passwordResetTokenExpiresAt < new Date()
    ) {
        throw new AppError(INVALID_RESET_TOKEN_MESSAGE, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await updateUserPassword(user.id, hashedPassword);

    return {
        message: "Password reset successfully. Please login to continue.",
    };
};

export const signupService = async ({ name, email, password }: SignupInput) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await createUser({
        name: name,
        email: normalizedEmail,
        password: hashedPassword,
    });

    await emailQueue.add(
        "welcome",
        {
            email,
        },
        {
            removeOnComplete: true,
            removeOnFail: true,
        },
    );

    return {
        message: "Account created. Please login to continue.",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
    };
};

export const loginService = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user || !user.password) {
        throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(pass, user.password);
    if (!isValidPassword) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = signToken(
        { id: user.id },
        config.JWTSecretKey,
        config.JWTExpiresIn,
    );

    return {
        token,
        message: "Login Successfull",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
};

export const googleLoginService = async (credential: string) => {
    const payload = await verifyGoogleToken(credential);

    const googleId = payload.sub;
    const email = payload.email?.trim().toLowerCase();

    if (!googleId || !email) {
        throw new AppError(
            "Google token payload is missing required data",
            400,
        );
    }

    let user = await findByEmailOrGoogleId(email, googleId);

    if (user) {
        if (!user.googleId) {
            await updateUserGoogleId(user.id, googleId);
        }
    } else {
        user = await createUser({
            email,
            name: payload.name ?? undefined,
            googleId,
            photo: payload.picture ?? undefined,
        });
    }

    const token = signToken(
        { id: user.id },
        config.JWTSecretKey,
        config.JWTExpiresIn,
    );

    return {
        token,
        message: "Login successful",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            photo: user.photo,
        },
    };
};
