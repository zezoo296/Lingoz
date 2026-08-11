import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route";
import globalErrorHandler from "./controllers/error.controller";
import { config } from "./config/env";

export const app = express();

app.use(
    cors({
        origin: config.clientOrigin,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Lingua Chat API is running" });
});

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);
