import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function GuestRoute() {
    const { data: user, isLoading } = useCurrentUser();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user) {
        if (!user.hasSeenOnboarding) return <Navigate to="/welcome" replace />;
        return <Navigate to="/chats" replace />;
    }

    return <Outlet />;
}
