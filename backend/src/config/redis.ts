import Redis from "ioredis";
import { config } from "./env";

const redisUrl = config.redisURL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
}

export const redis = new Redis(redisUrl, {
    family: 0,
});

export const bullmqRedis = new Redis(redisUrl, {
    family: 0,
    maxRetriesPerRequest: null,
});
