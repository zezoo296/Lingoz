import crypto from "crypto";

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const generateResetToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

export const hashValue = (value: string): string => {
    return crypto.createHash("sha256").update(value).digest("hex");
};

export const verifyHash = (value: string, hash: string): boolean => {
    const valueHash = hashValue(value);

    if (valueHash.length !== hash.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(valueHash, "hex"),
        Buffer.from(hash, "hex"),
    );
};
