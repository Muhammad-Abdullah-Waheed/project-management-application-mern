import { useAuth } from '@/provider/auth-context';
import { Navigate, Outlet } from 'react-router'

const AuthLayout = () => {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <Outlet />
    )
}

export default AuthLayout