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
    password: z.string().min(8, "Password must be at least 8 characters long").max(40, "Password must be at most 40 characters long"),
    token: z.string().min(1, "Token is required"),
});

const workspaceSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(40, "Name must be at most 40 characters long"),
    description: z.string().trim().optional(),
    color: z.string().optional(),
});

const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(40, "Title must be at most 40 characters long"),
    description: z.string().trim().optional(),
    status: z.enum(["Planing", "In Progress", "Completed", "On Hold", "Cancelled"]),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    progress: z.number().optional(),
    members: z.array(z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
    })).optional(),
    tags: z.string().optional(),
});

const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(40, "Title must be at most 40 characters long"),
    description: z.string().trim().optional(),
    status: z.enum(["To Do", "In Progress", "Review", "Done", "Cancelled"]),
    priority: z.enum(["Low", "Medium", "High", "Critical"]),
    dueDate: z.string().optional(),
    assignees: z.array(z.string()).optional(),
});

export {
    registerSchema, loginSchema, verifyEmailSchema,
    resetPasswordRequestSchema, resetPasswordSchema,
    workspaceSchema, projectSchema, createTaskSchema
};