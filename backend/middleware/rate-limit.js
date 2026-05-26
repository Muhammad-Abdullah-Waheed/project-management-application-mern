import rateLimit from "express-rate-limit";

/** Stricter limits for authentication routes (brute-force mitigation). */
export const authRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
});
