import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const config = {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL ?? "",
    JWTSecretKey: process.env.JWT_SECRET_KEY ?? "SUPER_SECRET_KEY",
    JWTExpiresIn: (process.env.JWT_EXPIRES_IN ??
        "1d") as jwt.SignOptions["expiresIn"],
    clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5000",
};
