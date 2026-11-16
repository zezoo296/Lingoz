import Redis from "ioredis";
import { config } from "./env";

const redisUrl = new URL(config.redisURL);
redisUrl.searchParams.set("family", "0");

const connectionUrl = redisUrl.toString();

export const redis = new Redis(connectionUrl);

export const bullmqRedis = new Redis(connectionUrl, {
    maxRetriesPerRequest: null,
});

redis.on("error", (err) => {
    console.error("[Redis Cache]", err.message);
});

bullmqRedis.on("error", (err) => {
    console.error("[Redis Queue]", err.message);
});
