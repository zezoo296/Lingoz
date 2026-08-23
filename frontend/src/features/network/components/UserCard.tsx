import { RiVerifiedBadgeFill, RiMapPinLine, RiMoreLine } from "react-icons/ri";
import { FiUserPlus } from "react-icons/fi";
import type { User } from "../types";

interface UserCardProps {
    user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="grid rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-hover sm:grid-cols-[minmax(14rem,1.15fr)_minmax(13rem,1fr)] sm:items-center lg:grid-cols-[minmax(15rem,1.15fr)_minmax(13rem,1fr)_minmax(10rem,.7fr)_auto]">
            {/* Identity and languages spoken */}
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="shrink-0 mb-5 sm:mb-0">
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover"
                        />
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
                            {user.name}
                        </h3>
                        {user.isVerified && (
                            <RiVerifiedBadgeFill className="w-4 h-4 text-brand-500 shrink-0" />
                        )}
                    </div>
                    <p className="text-sm text-text-muted">{user.username}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="flex items-center gap-1.5 text-text-secondary">
                            <span className="text-base">{user.nativeFlag}</span>
                            {user.nativeLang}
                        </span>
                        <span className="flex items-center gap-1.5 text-text-secondary">
                            {user.englishLevel}
                            <span className="text-base">{user.englishFlag}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Languages being learned */}
            <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider text-text-muted">
                    Learning
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {user.learning.map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-base">{lang.flag}</span>
                            <span className="text-text-secondary">
                                {lang.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location and presence */}
            <div className="border-border sm:border-l sm:pl-4 lg:pl-6 relative top-8.75 sm:top-0">
                <div className="text-left">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <RiMapPinLine className="w-4 h-4 shrink-0" />
                        <span>{user.location}</span>
                    </div>
                    <p
                        className={`text-sm ${
                            user.isOnline ? "text-success" : "text-text-muted"
                        }`}
                    >
                        {user.isOnline
                            ? "Online now"
                            : `Active ${user.lastActive}`}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:col-start-4 lg:row-start-1 ml-auto sm:ml-0">
                <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500">
                    <FiUserPlus className="w-4 h-4" />
                    Connect
                </button>
            </div>
        </div>
    );
};
