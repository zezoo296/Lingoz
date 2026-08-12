import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const findUserById = (id: number) => {
    return prisma.user.findFirst({
        where: {
            id,
        },
        omit: {
            password: true,
            googleId: true,
        },
    });
};

export const findUserByEmail = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email,
        },
    });
};

export const findUsers = (where: Prisma.UserWhereInput = {}) => {
    return prisma.user.findMany({
        where,
    });
};

export const createUser = (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
        data,
    });
};

export const updateUserGoogleId = (id: number, googleId: string) => {
    return prisma.user.update({
        where: { id },
        data: { googleId },
    });
};

export const updateUserPasswordResetOtp = (
    id: number,
    otpHash: string,
    expiresAt: Date,
) => {
    return prisma.user.update({
        where: { id },
        data: {
            passwordResetOtpHash: otpHash,
            passwordResetOtpExpiresAt: expiresAt,
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
        },
    });
};

export const updateUserPasswordResetToken = (
    id: number,
    tokenHash: string,
    expiresAt: Date,
) => {
    return prisma.user.update({
        where: { id },
        data: {
            passwordResetTokenHash: tokenHash,
            passwordResetTokenExpiresAt: expiresAt,
            passwordResetOtpHash: null,
            passwordResetOtpExpiresAt: null,
        },
    });
};

export const updateUserPassword = (id: number, hashedPassword: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
            passwordResetTokenHash: null,
            passwordResetTokenExpiresAt: null,
            passwordResetOtpHash: null,
            passwordResetOtpExpiresAt: null,
        },
    });
};

export const findUserByResetTokenHash = (tokenHash: string) => {
    return prisma.user.findFirst({
        where: {
            passwordResetTokenHash: tokenHash,
        },
    });
};

export const findByEmailOrGoogleId = (email: string, googleId: string) => {
    return prisma.user.findFirst({
        where: {
            OR: [{ googleId }, { email }],
        },
    });
};
