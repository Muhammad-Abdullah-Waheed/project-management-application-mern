import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .optional()
        .default("development"),
    MONGO_URL: z.string().min(1, "MONGO_URL is required"),
    JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
    FRONTEND_URL: z.string().optional(),
});

/**
 * Validates required env vars and exits on failure (fail fast in all environments).
 */
export function validateEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("Invalid or missing environment variables:");
        console.error(result.error.flatten().fieldErrors);
        process.exit(1);
    }
}
