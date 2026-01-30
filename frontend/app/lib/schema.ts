import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
    name: z.string().min(3, "Name should be at least 3 characters long"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password Should be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match"
})

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email"),
})

export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password Should be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match"
})

export const resetPasswordSendSchema = z.object({
    password: z.string().min(8, "Password Should be at least 8 characters long"),
    token: z.string().min(1, "Token is required"),
})

export const workspaceSchema = z.object({
    name: z.string().min(3, "Name should be at least 3 characters long"),
    description: z.string().optional(),
    color: z.string().min(1, "Color is required"),
})