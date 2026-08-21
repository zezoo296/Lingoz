import { Socket } from "socket.io";
import {
    verifyClientOrigin,
    authenticateFromCookie,
} from "../middleware/protect";

export const authenticateSocket = async (
    socket: Socket,
    next: (err?: Error) => void,
) => {
    try {
        verifyClientOrigin(socket.handshake.headers.origin);

        const user = await authenticateFromCookie(
            socket.handshake.headers.cookie,
        );

        socket.data.user = user;

        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error("Unauthorized"));
    }
};
