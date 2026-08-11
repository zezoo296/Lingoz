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
