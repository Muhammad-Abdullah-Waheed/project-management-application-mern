import { signInSchema } from '@/lib/schema';
import type z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
type SignInFormData = z.infer<typeof signInSchema>
const SignIn = () => {
    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const handleOnSubmit = (values: SignInFormData) => {
        console.log(values);
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted'>
            <Card className='max-w-md w-full shadow-xl'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-bold'>Welcome back</CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>Sign in to your account for continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base font-medium'>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Abcd@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex justify-between items-center'>
                                            <FormLabel className='text-base font-medium'>Password</FormLabel>
                                            <Link to="/forget-password" className="text-sm font-medium text-gray-500 hover:underline hover:scale-105 transition-all duration-200">Forget Password?</Link>
                                        </div>

                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>Sign In</Button>
                        </form>
                    </Form>


                </CardContent>
                <CardFooter>
                    <div className='flex justify-center items-center w-full'>
                        Don't have an account?{" "}
                        <Link to="/sign-up" className="text-primary underline ml-1">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignIn;