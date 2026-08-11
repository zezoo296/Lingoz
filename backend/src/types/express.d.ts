import type { User } from "../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: Pick<User, "id" | "name" | "email">;
        }
    }
}

export {};
