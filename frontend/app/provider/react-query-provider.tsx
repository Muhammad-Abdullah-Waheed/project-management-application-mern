import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";

export const queryClient = new QueryClient();

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Toaster position="top-center" richColors />
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}