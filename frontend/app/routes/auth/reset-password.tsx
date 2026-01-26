import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, CheckSquare2 } from "lucide-react";
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type z from "zod";
import { resetPasswordSchema, resetPasswordSendSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ResetPasswordSendData = z.infer<typeof resetPasswordSendSchema>
const ResetPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const tokenParam = searchParams.get("token");

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    const { mutate: resetPassword, isPending } = useResetPasswordMutation()
    const onSubmit = (data: ResetPasswordFormData) => {
        const sendData: ResetPasswordSendData = {
            password: data.password,
            token: tokenParam as string
        }
        if (!tokenParam) {
            toast.error("Token is required")
            return;
        }
        resetPassword(sendData, {
            onSuccess: () => {
                toast.success("Password reset successfully")
                setIsSuccess(true);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Failed to reset password"
                toast.error(errorMessage)
                setIsSuccess(false);
                form.reset();
            }
        })
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md hover:shadow-lg">
                <Card className="flex flex-col gap-2">
                    <CardHeader>
                        <CardTitle className="text-center">
                            <h1 className="text-2xl font-bold">Reset Password</h1>
                            <p className="text-sm text-gray-500">Enter your new password.</p>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">
                        {isSuccess ? (
                            <div className="text-center">
                                <CheckSquare2 className="h-12 w-12 text-green-500 mx-auto" />
                                <h1 className="text-2xl font-bold">Password reset successfully</h1>
                                <p className="text-sm text-gray-500">You can now login with your new password</p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your password" {...field} type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your confirm password" {...field} type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="hover:scale-95" type="submit" disabled={isPending}>
                                        {isPending ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center mt-2">
                        <Link to="/sign-in" className="flex items-center underline"><ArrowLeft className="mr-2 inline" />Go back to Sign In</Link>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}

export default ResetPassword;