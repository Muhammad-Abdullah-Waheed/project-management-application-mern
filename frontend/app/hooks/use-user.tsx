import { fetchData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, type QueryKey } from "@tanstack/react-query";
import { z } from "zod";

const queryKey: QueryKey = ["user"];

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: "Current password is required" }),
        newPassword: z.string().min(8, { message: "New password is required" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Confirm password is required" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const profileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    profilePicture: z.string().optional(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

export const useUserProfileQuery = () => {
    return useQuery({
        queryKey,
        queryFn: () => fetchData("/users/profile"),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) =>
            updateData("/users/change-password", data),
    });
};

export const useUpdateUserProfile = () => {
    return useMutation({
        mutationFn: (data: ProfileFormData) => updateData("/users/profile", data),
    });
};
