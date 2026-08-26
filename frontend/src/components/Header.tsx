import {
    RiChat1Line,
    RiMessage3Fill,
    RiNotification3Line,
    RiTeamLine,
    RiUserLine,
} from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";

import { logout } from "../features/auth/api/authApi";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const navigationItems = [
        { label: "Chats", path: "/chats", icon: RiChat1Line },
        { label: "Network", path: "/network", icon: RiTeamLine },
        { label: "Friends", path: "/friends", icon: FaUserFriends },
        { label: "Profile", path: "/profile", icon: RiUserLine },
    ];
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await logout();

        queryClient.removeQueries({
            queryKey: ["current-user"],
        });

        navigate("/", { viewTransition: true });
    };
    return (
        <header className="sticky top-0 z-50 bg-background-secondary/80 text-text-primary backdrop-blur-md shadow-2xl border-b border-border">
            <nav className="max-w-360 mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                        <RiMessage3Fill className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold hidden sm:inline">
                        Lingoz
                    </span>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                    {navigationItems.map(({ label, path, icon: Icon }) => {
                        const isActive = location.pathname === path;

                        return (
                            <button
                                key={path}
                                type="button"
                                onClick={() =>
                                    navigate(path, { viewTransition: true })
                                }
                                className={`flex items-center gap-2 pb-4 -mb-4 transition-colors ${
                                    isActive
                                        ? "text-brand-500 font-medium border-b-2 border-brand-500"
                                        : "text-text-muted hover:text-text-secondary"
                                }`}
                                title={label}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Icon className="w-6 h-6 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="relative text-text-muted hover:text-text-secondary transition-colors">
                        <RiNotification3Line className="w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                            3
                        </span>
                    </button>
                    <div
                        className="w-9 h-9 rounded-full bg-linear-to-br from-brand-500 to-brand-800 flex items-center justify-center text-sm font-semibold"
                        onClick={handleLogout}
                    >
                        Z
                    </div>
                </div>
            </nav>
        </header>
    );
}
