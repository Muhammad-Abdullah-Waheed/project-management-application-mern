import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { sendVerificationEmail, sendPasswordResetEmail } from "./bravo-email.js";
import dotenv from "dotenv";

dotenv.config();

const maxRetriesPerRequest = null;

function createRedisConnection() {
    if (process.env.REDIS_URL) {
        return new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest });
    }
    return new IORedis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
    });
}

export const connection = createRedisConnection();

export const emailQueue = new Queue("email-queue", { connection });

export const emailWorker = new Worker(
    "email-queue",
    async (job) => {
        if (job.name === "send-verification") {
            const { email, token } = job.data;
            await sendVerificationEmail(email, token);
        } else if (job.name === "send-password-reset") {
            const { email, token } = job.data;
            await sendPasswordResetEmail(email, token);
        }
    },
    {
        connection,
        limiter: {
            max: 5,
            duration: 1000,
        },
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Email job ${job.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Email job ${job.id} failed with ${err.message}`);
});

export async function closeEmailQueue() {
    await emailWorker.close();
    await emailQueue.close();
    await connection.quit();
}
