import type { User } from "@/types";
import React from "react";
import { queryClient } from "./react-query-provider";
import { useNavigate, useLocation } from "react-router";
import { publicRoutes } from "@/lib/fetch-util";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);


    const location = useLocation().pathname;
    const isPublicRoute = publicRoutes.includes(location);
    const navigate = useNavigate();

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                if (!isPublicRoute) {
                    navigate("/sign-in");
                }
            }
        } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
            if (!isPublicRoute) {
                navigate("/sign-in");
            }
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        checkAuth();
    }, []);

    React.useEffect(() => {
        const handleLogout = () => {
            logout();
            navigate("/sign-in");
        };
        window.addEventListener("force-logout", handleLogout);
        return () => {
            window.removeEventListener("force-logout", handleLogout);
        };
    }, []);

    const login = async (data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
    };

    const value = { user, isAuthenticated, isLoading, login, logout };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};