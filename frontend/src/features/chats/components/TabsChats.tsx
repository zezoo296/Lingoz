import type { Tabs } from "../lib/helpers";

type TabsChatsProps = {
    onTabChange: (arg0: Tabs) => void;
    selectedTab: Tabs;
};

export default function TabsChats({
    onTabChange,
    selectedTab,
}: TabsChatsProps) {
    return (
        <div className="flex items-center gap-2 p-4 pb-2 overflow-x-auto">
            <button
                className={`px-4 py-1.5 rounded-lg ${selectedTab === "All" ? "bg-brand-500 text-white" :  "bg-surface-elevated text-text-secondary"}  text-sm font-medium shrink-0`}
                onClick={() => onTabChange("All")}
            >
                All
            </button>
            <button
                className={`px-4 py-1.5 rounded-lg ${selectedTab === "Unread" ? "bg-brand-500 text-white" :  "bg-surface-elevated text-text-secondary"} text-sm font-medium hover:bg-surface-hover transition-colors shrink-0`}
                onClick={() => onTabChange("Unread")}
            >
                Unread
            </button>
            <button
                className={`px-4 py-1.5 rounded-lg ${selectedTab === "Favourites" ? "bg-brand-500 text-white" :  "bg-surface-elevated text-text-secondary"} text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors shrink-0`}
                onClick={() => onTabChange("Favourites")}
            >
                Favorites
            </button>
            <button
                className={`px-4 py-1.5 rounded-lg ${selectedTab === "Group" ? "bg-brand-500 text-white" :  "bg-surface-elevated text-text-secondary"} text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors shrink-0`}
                onClick={() => onTabChange("Group")}
            >
                Groups
            </button>
        </div>
    );
}
