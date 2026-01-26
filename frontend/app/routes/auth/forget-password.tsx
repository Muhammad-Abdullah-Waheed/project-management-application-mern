import { forgotPasswordSchema } from "@/lib/schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { ArrowLeft, MailCheck } from "lucide-react"
import { useForgotPasswordMutation } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export type ForgetPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgetPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const form = useForm<ForgetPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    })
    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation()
    const onSubmit = (data: ForgetPasswordFormData) => {
        forgotPassword(data, {
            onSuccess: () => {
                toast.success("Password reset email sent successfully")
                setIsSuccess(true);
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Failed to send password reset email"
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
                            <h1 className="text-2xl font-bold">Forget Password</h1>
                            <p className="text-sm text-gray-500">Enter your email to reset your password.</p>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">
                        {isSuccess ? (
                            <div className="text-center">
                                <MailCheck className="h-12 w-12 text-green-500 mx-auto" />
                                <h1 className="text-2xl font-bold">Password reset email sent !</h1>
                                <p className="text-sm text-gray-500">Check your email for a link to reset your password.</p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your email" {...field} />
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

export default ForgetPassword