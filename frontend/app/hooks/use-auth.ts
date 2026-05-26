import { useMutation } from "@tanstack/react-query";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import type { SignInFormData } from "@/routes/auth/sign-in";
import type { ForgetPasswordFormData } from "@/routes/auth/forget-password";
import type { ResetPasswordFormData, ResetPasswordSendData } from "@/routes/auth/reset-password";
import { postData } from "@/lib/fetch-util";


export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
    });
}

export const useEmailVerifyMutation = () => {
    return useMutation({
        mutationFn: (token: string) => postData("/auth/verify-email", { token }),
    });
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: SignInFormData) => postData("/auth/login", data),
    });
}

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ForgetPasswordFormData) => postData("/auth/reset-password-request", data),
    });
}

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordSendData) => postData("/auth/reset-password", data),
    });
}




