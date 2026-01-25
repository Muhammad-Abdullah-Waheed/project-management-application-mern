import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(40, "Name must be at most 40 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(40, "Password must be at most 40 characters long"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(40, "Password must be at most 40 characters long"),
});

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

const resetPasswordRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(40, "Password must be at most 40 characters long"),
    token: z.string().min(1, "Token is required"),
});

export { registerSchema, loginSchema, verifyEmailSchema, resetPasswordRequestSchema, resetPasswordSchema };