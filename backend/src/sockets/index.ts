import { Server } from "socket.io";
import { authenticateSocket } from "./auth";
import { registerChatEvents } from "./chats/chats.events";
import { redis } from "../config/redis";
import { updateUser } from "../repositories/user.repository";
import { redisKeys } from "../redis/keys";

export const initializeSockets = (io: Server) => {
    io.use(authenticateSocket);

    io.on("connection", async (socket) => {
        const userId = socket.data.user.id;
        const key = redisKeys.userSockets(userId);

        await redis.sadd(key, socket.id);

        registerChatEvents(socket, io);

        socket.on("disconnect", async () => {
            await redis.srem(key, socket.id);
            await redis.del(redisKeys.socketOpenChat(userId, socket.id));
            
            const remainingSockets = await redis.scard(key);

            if (remainingSockets === 0) {
                await updateUser(socket.data.user.id, { lastSeen: new Date() });
                //emit event
            }
        });
    });
};
