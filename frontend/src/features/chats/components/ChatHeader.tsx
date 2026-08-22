// components/ChatHeader.tsx
import { RiArrowLeftLine } from "react-icons/ri";

interface ChatHeaderProps {
    name: string;
    photo?: string;
    type: "Direct" | "Group";
    onBack?: () => void;
}

export function ChatHeader({ name, photo, type, onBack }: ChatHeaderProps) {
    return (
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface/50">
            {onBack && (
                <button
                    onClick={onBack}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-elevated transition-colors text-text-secondary"
                    aria-label="Back to chat list"
                >
                    <RiArrowLeftLine className="w-5 h-5" />
                </button>
            )}

            <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                {photo ? (
                    <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-brand-500 font-semibold">
                        {name.charAt(0) || "?"}
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-medium text-text-primary truncate">{name}</p>
                {type === "Group" && (
                    <p className="text-xs text-text-muted">Group chat</p>
                )}
            </div>
        </div>
    );
}
