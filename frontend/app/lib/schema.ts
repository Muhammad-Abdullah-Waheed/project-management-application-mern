import { ProjectStatus, TaskStatus } from "@/types";
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

export const projectSchema = z.object({
    title: z.string().min(3, "Title should be at least 3 characters long"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(1, "Start Date is required"),
    dueDate: z.string().min(1, "Due Date is required"),
    progress: z.number().min(0, "Progress should be at least 0").max(100, "Progress should be at most 100"),
    members: z.array(
        z.object({
            user: z.string(),
            role: z.enum(["manager", "contributor", "viewer"]),
        })
    ).optional(),
    tags: z.string().optional(),
})

export const createTaskSchema = z.object({
    title: z.string().min(3, "Title should be at least 3 characters long"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Review", "Done", "Cancelled"]),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    dueDate: z.string().min(1, "Due Date is required"),
    assignees: z.array(z.string()).min(1, "Assignee is required"),
})