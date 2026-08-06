import express from "express";
import prisma from "./config/prisma";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Lingua Chat API is running" });
});
