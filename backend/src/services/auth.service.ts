import bcrypt from "bcrypt";
import AppError from "../utils/AppError";
import { config } from "../config/env";
import type { SignupInput } from "@linguachat/shared";
import { findUserByEmail, createUser } from "../repositories/user.repository";
import { signToken } from "../utils/jwt";

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
