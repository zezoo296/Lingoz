import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import type { SignupInput } from "../schemas/auth.schema";
import { findUserByEmail, createUser } from "../repositories/auth.repository";

const signupService = async ({ name, email, password }: SignupInput) => {
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

export default signupService;
