import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendVerificationEmail, sendPasswordResetEmail } from './bravo-email.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
});

export const emailQueue = new Queue('email-queue', { connection });

const worker = new Worker('email-queue', async (job) => {
    if (job.name === 'send-verification') {
        const { email, token } = job.data;
        await sendVerificationEmail(email, token);
    } else if (job.name === 'send-password-reset') {
        const { email, token } = job.data;
        await sendPasswordResetEmail(email, token);
    }

}, {
    connection,
    limiter: {
        max: 5, // Process max 5 jobs
        duration: 1000, // per 1 second
    },
});

worker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`Email job ${job.id} failed with ${err.message}`);
});
