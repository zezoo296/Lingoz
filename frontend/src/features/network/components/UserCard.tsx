import { RiVerifiedBadgeFill, RiMapPinLine } from "react-icons/ri";
import {
    getCountryNameFromCode,
    getLanguageNameFromCode,
} from "../../../lib/nameCode";
import type { DiscoveryUser } from "@linguachat/shared";
import ConnectButton from "./ConnectButton";


interface UserCardProps {
    user: DiscoveryUser;
}

// Format "lastSeen" into a human-readable "Active X ago" string
const formatLastActive = (lastSeen: string): string => {
    const now = new Date();
    const last = new Date(lastSeen);
    const diffMs = now.getTime() - last.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return last.toLocaleDateString();
};

// Generate initials from name (up to 2 characters)
const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generate a deterministic color from a string
const getColorFromString = (str: string | null | undefined): string => {
    if (!str) return "#6366f1";
    const colors = [
        "#6366f1", // indigo
        "#8b5cf6", // violet
        "#ec4899", // pink
        "#f43f5e", // rose
        "#f97316", // orange
        "#eab308", // yellow
        "#22c55e", // green
        "#06b6d4", // cyan
        "#3b82f6", // blue
        "#a855f7", // purple
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

export const UserCard = ({ user }: UserCardProps) => {
    const lastActiveText = user.isOnline
        ? "Online now"
        : user.lastSeen
          ? `Active ${formatLastActive(user.lastSeen)}`
          : "Offline";

    const countryName = user.countryCode
        ? getCountryNameFromCode(user.countryCode as any)
        : null;
    const location =
        [countryName, user.city].filter(Boolean).join(", ") ||
        "Unknown location";

    const speakingLanguages = user.userLanguages.filter((l) => l.isSpeaking);
    const learningLanguages = user.userLanguages.filter((l) => l.isLearning);

    const hasPhoto = !!user.photo;
    const initials = getInitials(user.name);
    const avatarBg = getColorFromString(user.name || user.username);

    return (
        <div className="grid rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-hover sm:grid-cols-[minmax(14rem,1.15fr)_minmax(13rem,1fr)] sm:items-center lg:grid-cols-[minmax(15rem,1.15fr)_minmax(13rem,1fr)_minmax(10rem,.7fr)_auto]">
            {/* Identity and languages spoken */}
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="shrink-0 mb-5 sm:mb-0">
                    <div className="relative">
                        {hasPhoto ? (
                            <img
                                src={user.photo || ""}
                                alt={user.name ?? "User"}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold"
                                style={{ backgroundColor: avatarBg }}
                            >
                                {initials}
                            </div>
                        )}
                        <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                                user.isOnline ? "bg-success" : "bg-text-muted"
                            }`}
                        />
                    </div>
                </div>

                {/* Name, username & spoken languages */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-text-primary text-sm truncate">
                            {user.name ?? "Unnamed User"}
                        </h3>
                        <RiVerifiedBadgeFill className="w-4 h-4 text-brand-500 shrink-0" />
                    </div>
                    <p className="text-sm text-text-muted">
                        {user.username ?? `@user_${user.id}`}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        {speakingLanguages.length > 0 ? (
                            speakingLanguages.map((lang, idx) => (
                                <span
                                    key={idx}
                                    className="flex items-center gap-1.5 text-text-secondary"
                                >
                                    <span className="text-base">🏳️</span>
                                    {getLanguageNameFromCode(
                                        lang.languageCode as any,
                                    )}
                                </span>
                            ))
                        ) : (
                            <span className="text-text-muted text-sm">
                                No languages listed
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Languages being learned */}
            <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider text-text-muted">
                    Learning
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {learningLanguages.length > 0 ? (
                        learningLanguages.map((lang, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-1.5"
                            >
                                <span className="text-base">🏳️</span>
                                <span className="text-text-secondary">
                                    {getLanguageNameFromCode(
                                        lang.languageCode as any,
                                    )}
                                </span>
                            </div>
                        ))
                    ) : (
                        <span className="text-text-muted text-sm">
                            Not learning any languages yet
                        </span>
                    )}
                </div>
            </div>

            {/* Location and presence */}
            <div className="relative top-0 border-border sm:border-l sm:pl-4 lg:pl-6 sm:top-0 mt-4 lg:mt-0">
                <div className="text-left">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <RiMapPinLine className="w-4 h-4 shrink-0" />
                        <span>{location}</span>
                    </div>
                    <p
                        className={`text-sm ${
                            user.isOnline ? "text-success" : "text-text-muted"
                        }`}
                    >
                        {lastActiveText}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex items-center justify-end gap-2 pt-2 sm:ml-0 sm:pt-0 lg:col-start-4 lg:row-start-1">
                <ConnectButton recieverId={user.id}/>
            </div>
        </div>
    );
};
