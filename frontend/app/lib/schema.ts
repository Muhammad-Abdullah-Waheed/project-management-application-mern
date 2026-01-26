import { data } from "react-router";
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