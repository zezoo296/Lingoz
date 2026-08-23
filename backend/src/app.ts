import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import friendshipRouter from "./routes/friendship.route";
import chatsRouter from "./routes/chat.route";
import globalErrorHandler from "./controllers/error.controller";
import { config } from "./config/env";

export const app = express();

app.use(
    cors({
        origin: [config.clientOrigin, "http://192.168.1.6:5173"],
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Lingua Chat API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/friendships", friendshipRouter);
app.use("/api/v1/chats", chatsRouter);

app.use(globalErrorHandler);
