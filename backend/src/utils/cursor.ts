import AppError from "./AppError";

export type Cursor = {
    createdAt: Date;
    id: string ;
};

export const olderThanCursor = (cursor: Cursor) => ({
    OR: [
        { createdAt: { lt: cursor.createdAt } },
        {
            createdAt: cursor.createdAt,
            id: { lt: cursor.id },
        },
    ],
});

export const encodeCursor = (cursor: Cursor): string => {
    return Buffer.from(
        JSON.stringify({
            createdAt: cursor.createdAt.toISOString(),
            id: cursor.id,
        }),
        "utf8",
    ).toString("base64url");
};

export const decodeCursor = (cursor: string): Cursor => {
    try {
        const parsed: unknown = JSON.parse(
            Buffer.from(cursor, "base64url").toString("utf8"),
        );

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            typeof (parsed as { id?: unknown }).id !== "string" ||
            typeof (parsed as { createdAt?: unknown }).createdAt !== "string"
        ) {
            throw new Error("Invalid cursor payload");
        }

        const createdAt = new Date(
            (parsed as { createdAt: string }).createdAt,
        );
        if (Number.isNaN(createdAt.getTime())) {
            throw new Error("Invalid cursor date");
        }

        return {
            createdAt,
            id: (parsed as { id: string }).id,
        };
    } catch {
        throw new AppError("Invalid cursor", 400);
    }
};
