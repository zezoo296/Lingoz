import { Worker } from "bullmq";
import { bullmqRedis } from "../config/redis";
import {
    sendPasswordResetOtpEmail,
    sendWelcomeEmail,
} from "../services/email.service";

const worker = new Worker(
    "email",
    async (job) => {
        switch (job.name) {
            case "password-reset":
                await sendPasswordResetOtpEmail(job.data.email, job.data.otp);
                break;

            case "welcome":
                await sendWelcomeEmail(job.data.email);
                break;

            default:
                throw new Error(`Unknown job: ${job.name}`);
        }
    },
    {
        connection: bullmqRedis,
    },
);

worker.on("completed", (job) => {
    
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});
