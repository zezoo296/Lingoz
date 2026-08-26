export const redisKeys = {
    userSockets: (userId: number) => `user:${userId}:sockets`,

    socketOpenChat: (userId: number, socketId: string) =>
        `user:${userId}:socket:${socketId}:openChat`,

    onlineUsers: () => "online-users",
};
