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
        const socketKey = redisKeys.userSockets(userId);
        console.log("User: ", userId, " connected with socket ", socket.id);
        await redis.sadd(socketKey, socket.id);
        await redis.sadd(redisKeys.onlineUsers(), userId);

        registerChatEvents(socket, io);

        socket.on("disconnect", async (reason) => {
            console.log("========== DISCONNECT ==========");
            console.log("user:", userId);
            console.log("socket:", socket.id);
            console.log("reason:", reason);
            console.log("key:", socketKey);

            try {
                const exists = await redis.sismember(socketKey, socket.id);

                console.log("Exists:", exists);

                const removed = await redis.srem(socketKey, socket.id);

                console.log("Removed:", removed);

                const remainingSockets = await redis.scard(socketKey);

                console.log("Remaining sockets:", remainingSockets);

                await redis.del(redisKeys.socketOpenChat(userId, socket.id));

                if (remainingSockets === 0) {
                    await redis.srem(redisKeys.onlineUsers(), userId);

                    await updateUser(userId, {
                        lastSeen: new Date(),
                    });
                }
            } catch (err) {
                console.error("Disconnect cleanup error:", err);
            }
        });
    });
};
