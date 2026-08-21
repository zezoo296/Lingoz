import { RiChat1Line, RiMessage3Fill, RiNotification3Line, RiTeamLine, RiUserLine } from "react-icons/ri";
import { logout } from "../features/auth/api/authApi";
import { useNavigate } from "react-router";


export default function Header() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/");
    }
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
                    <button className="flex items-center gap-2 text-brand-500 font-medium border-b-2 border-brand-500 pb-4 -mb-4" title="Chats">
                        <RiChat1Line className="w-6 h-6 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Chats</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors pb-4 -mb-4" title="Network">
                        <RiTeamLine className="w-6 h-6 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Network</span>
                    </button>
                    <button className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors pb-4 -mb-4" title="Profile">
                        <RiUserLine className="w-6 h-6 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="relative text-text-muted hover:text-text-secondary transition-colors">
                        <RiNotification3Line className="w-6 h-6 sm:w-5 sm:h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                            3
                        </span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-500 to-brand-800 flex items-center justify-center text-sm font-semibold" onClick={handleLogout}>
                        Z
                    </div>
                </div>
            </nav>
        </header>
    );
}
