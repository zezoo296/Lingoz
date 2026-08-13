import { Queue } from "bullmq";
import { bullmqRedis } from "../config/redis";

export const emailQueue = new Queue("email", {
    connection: bullmqRedis
})