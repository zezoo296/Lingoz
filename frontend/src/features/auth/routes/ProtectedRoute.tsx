import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProtectedRoute() {
    const { data: user, isLoading } = useCurrentUser();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
