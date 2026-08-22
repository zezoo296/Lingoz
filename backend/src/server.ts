import { app } from "./app";
import { config } from "./config/env";
import http from "http";
import { Server } from "socket.io";
import { initializeSockets } from "./sockets";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: [config.clientOrigin, "http://192.168.1.8:5173"],
        credentials: true,
    },
});

initializeSockets(io);

httpServer.listen(config.port, () => {
    console.log(`Server running on ${config.port}`);
});
