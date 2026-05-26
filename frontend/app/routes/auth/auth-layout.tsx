import { useAuth } from '@/provider/auth-context';
import { Navigate, Outlet } from 'react-router'
import Loader from '@/components/ui/loader';

const AuthLayout = () => {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <Loader />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <Outlet />
    )
}

export default AuthLayout