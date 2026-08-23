import { useState } from "react";
import { RiEqualizerLine, RiCloseLine, RiSearchLine } from "react-icons/ri";
import { NetworkSidebar } from "../components/NetworkSidebar";
import { NetworkHeader } from "../components/NetworkHeader";
import { UserCard } from "../components/UserCard";
import { Pagination } from "../components/Pagination";
import type { User } from "../types";
import NetworkSearch from "../components/NetworkSearch";

const users: User[] = [
    {
        id: 1,
        name: "Lucía Fernández",
        username: "@lucia_fdz",
        avatar: "https://i.pravatar.cc/150?img=1",
        nativeLang: "Spanish",
        nativeFlag: "🇪🇸",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "French", flag: "🇫🇷" },
        ],
        location: "Madrid, Spain",
        isOnline: true,
        lastActive: null,
        isVerified: true,
    },
    {
        id: 2,
        name: "Hiroshi Nakamura",
        username: "@hiro_nakamura",
        avatar: "https://i.pravatar.cc/150?img=11",
        nativeLang: "Japanese",
        nativeFlag: "🇯🇵",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "Spanish", flag: "🇪🇸" },
        ],
        location: "Tokyo, Japan",
        isOnline: true,
        lastActive: null,
        isVerified: true,
    },
    {
        id: 3,
        name: "Camille Dubois",
        username: "@camille.d",
        avatar: "https://i.pravatar.cc/150?img=5",
        nativeLang: "French",
        nativeFlag: "🇫🇷",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "Italian", flag: "🇮🇹" },
        ],
        location: "Lyon, France",
        isOnline: false,
        lastActive: "5m ago",
        isVerified: true,
    },
    {
        id: 4,
        name: "Arjun Patel",
        username: "@arjun.patel",
        avatar: "https://i.pravatar.cc/150?img=12",
        nativeLang: "Hindi",
        nativeFlag: "🇮🇳",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "German", flag: "🇩🇪" },
        ],
        location: "Mumbai, India",
        isOnline: false,
        lastActive: "15m ago",
        isVerified: true,
    },
    {
        id: 5,
        name: "Sofia Rossi",
        username: "@sofiarossi",
        avatar: "https://i.pravatar.cc/150?img=9",
        nativeLang: "Italian",
        nativeFlag: "🇮🇹",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "Portuguese", flag: "🇧🇷" },
        ],
        location: "Milan, Italy",
        isOnline: false,
        lastActive: "1h ago",
        isVerified: true,
    },
    {
        id: 6,
        name: "Wei Zhang",
        username: "@weizhang",
        avatar: "https://i.pravatar.cc/150?img=13",
        nativeLang: "Chinese",
        nativeFlag: "🇨🇳",
        englishLevel: "English",
        englishFlag: "🇺🇸",
        learning: [
            { name: "English", flag: "🇺🇸" },
            { name: "French", flag: "🇫🇷" },
        ],
        location: "Beijing, China",
        isOnline: false,
        lastActive: "3h ago",
        isVerified: true,
    },
];

export default function NetworkPage() {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <div className="flex flex-col lg:flex-row">
                {/* Mobile Filter Toggle */}
                <div className="p-4 lg:hidden">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                        {showMobileFilters ? (
                            <RiCloseLine className="w-5 h-5" />
                        ) : (
                            <RiEqualizerLine className="w-5 h-5" />
                        )}
                        {showMobileFilters ? "Close filters" : "Filters"}
                    </button>
                </div>

                {/* Filters sidebar */}
                <aside
                    className={`${
                        showMobileFilters ? "block" : "hidden"
                    } w-full bg-surface border-b border-border lg:flex lg:w-80 xl:w-96 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0`}
                >
                    <NetworkSidebar
                        onlineStatus={onlineStatus}
                        setOnlineStatus={setOnlineStatus}
                    />
                </aside>

                {/* Main Content */}
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10">
                    <NetworkHeader />

                    <NetworkSearch />

                    {/* Users List */}
                    <div className="space-y-2">
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={13}
                        onPageChange={setCurrentPage}
                    />
                </main>
            </div>
        </div>
    );
}
