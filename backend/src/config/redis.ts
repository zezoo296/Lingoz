import Redis from "ioredis";
import { config } from "./env";

const redisUrl = config.redisURL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
}

export const redis = new Redis(redisUrl); //Cache

export const bullmqRedis = new Redis(redisUrl, { //Queue
    maxRetriesPerRequest: null,
});