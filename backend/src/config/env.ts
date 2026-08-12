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
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? "745993027366-jq3tbdv6nn07dkvssvu0v7vf558c2ftk.apps.googleusercontent.com",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    resendFromEmail:
        process.env.RESEND_FROM_EMAIL ?? "LinguaChat <onboarding@resend.dev>",
    passwordResetOtpExpiresInMs: 5 * 60 * 1000,
    passwordResetTokenExpiresInMs: 15 * 60 * 1000,
};

console.log(config);