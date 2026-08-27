import { HiUsers } from "react-icons/hi";

export default function EmptyChats({onNewChat}: {onNewChat?: () => void}) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated flex items-center justify-center mb-4">
                <HiUsers className="w-7 h-7 text-brand-500" />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">
                No conversations yet
            </h3>
            <p className="text-sm text-text-muted mb-4 max-w-xs">
                Start chatting and your conversations will appear here.
            </p>
            <button onClick={onNewChat} className="px-5 py-2 rounded-xl border border-border text-brand-500 text-sm font-medium hover:bg-surface-hover hover:border-border-hover transition-all">
                Start a new chat
            </button>
        </div>
    );
}
