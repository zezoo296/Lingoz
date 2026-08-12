import { config } from "../config/env";
import googleClient from "../config/google";
import AppError from "./AppError";

export async function verifyGoogleToken(credential: string) {
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (
        payload?.iss !== "https://accounts.google.com" &&
        payload?.iss !== "accounts.google.com"
    ) {
        throw new AppError("Invalid token issuer", 400);
    }

    if (!payload.email_verified) {
        throw new AppError("Google email not verified", 400);
    }
    return payload;
}
