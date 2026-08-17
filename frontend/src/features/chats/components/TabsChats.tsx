export default function TabsChats() {
    return (
        <div className="flex items-center gap-2 p-4 pb-2 overflow-x-auto">
            <button className="px-4 py-1.5 rounded-lg bg-brand-500 text-white text-sm font-medium shrink-0">
                All
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-surface-elevated text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors shrink-0">
                Unread
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-surface-elevated text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors shrink-0">
                Favorites
            </button>
            <button className="px-4 py-1.5 rounded-lg bg-surface-elevated text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors shrink-0">
                Groups
            </button>
        </div>
    );
}
