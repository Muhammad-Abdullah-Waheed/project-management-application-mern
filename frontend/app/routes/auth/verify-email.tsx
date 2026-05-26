import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { XCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmailVerifyMutation } from '@/hooks/use-auth';


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, isError, isIdle } = useEmailVerifyMutation();
  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Email verified successfully!");
    } else if (isError) {
      toast.error("Failed to verify email. Please try again.");
    }
  }, [isSuccess, isError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 ">
      <Card className="w-full max-w-md shadow-lg rounded-xl hover:scale-104 transition-all">

        {/* Header */}
        <CardHeader className='text-center'>
          <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-col items-center justify-center">

          {/* Icon */}
          <div className="mt-4">
            {isPending ? (
              <Loader2 className="w-20 h-20 animate-spin text-gray-700" />
            ) : isSuccess ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          {/* Status Message */}
          {!token ? (
            <>
              <p className="text-red-400 text-center">We are unable to verify your email address.</p>
              <h1 className="text-lg font-semibold">Token not Provided</h1>
            </>
          ) : isPending ? (
            <>
              <p className="text-yellow-500 text-center">Please wait while we verify your email address...</p>
              <h1 className="text-lg font-semibold">Verifying Email</h1>
            </>
          ) : isSuccess ? (
            <>
              <p className="text-green-500 text-center">Your email has been verified successfully.</p>
              <h1 className="text-lg font-semibold">Email Verified</h1>
            </>
          ) : isIdle ? (
            <>
              <p className="text-red-400 text-center">We could not verify your email. Please try again.</p>
              <h1 className="text-lg font-semibold">Verification Failed</h1>
            </>
          ) : null}

        </CardContent>

        {/* Footer */}
        <CardFooter className="py-4">
          <Button
            onClick={() => navigate("/sign-in")}
            className="w-full hover:scale-101 transition-shadow font-semibold"
          >
            Back to Login
          </Button>
        </CardFooter>

      </Card>
    </div>

  )
}

export default VerifyEmail