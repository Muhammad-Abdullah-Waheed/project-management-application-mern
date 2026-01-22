import { signUpSchema } from '@/lib/schema';
import type z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
type SignUpFormData = z.infer<typeof signUpSchema>
const SignUp = () => {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
    const handleOnSubmit = (values: SignUpFormData) => {
        console.log(values);
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted'>
            <Card className='max-w-md w-full shadow-xl'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-bold'>Sign Up</CardTitle>
                    <CardDescription className='text-sm text-muted-foreground'>Sign up to new account for continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base font-medium'>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Abdullah" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <FormLabel className='text-base font-medium'>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
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
                                        <FormLabel className='text-base font-medium'>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>Sign Up</Button>
                        </form>
                    </Form>


                </CardContent>
                <CardFooter>
                    <div className='flex justify-center items-center w-full'>
                        Already have an account?{" "}
                        <Link to="/sign-in" className="underline ml-1">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUp;