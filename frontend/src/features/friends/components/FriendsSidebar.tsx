import {
    RiCheckboxBlankCircleFill,
    RiUserAddLine,
    RiUserReceivedLine,
    RiUserSharedLine,
} from "react-icons/ri";

export type FriendsTab = "connections" | "sent" | "received";

const tabs: Array<{
    id: FriendsTab;
    label: string;
    description: string;
    icon: typeof RiUserSharedLine;
}> = [
    {
        id: "connections",
        label: "Connections",
        description: "People you learn with",
        icon: RiUserSharedLine,
    },
    {
        id: "sent",
        label: "Sent requests",
        description: "Requests awaiting a reply",
        icon: RiUserAddLine,
    },
    {
        id: "received",
        label: "Received requests",
        description: "New people who want to connect",
        icon: RiUserReceivedLine,
    },
];

type FriendsSidebarProps = {
    selectedTab: FriendsTab;
    onTabChange: (tab: FriendsTab) => void;
    receivedCount: number;
};

export function FriendsSidebar({
    selectedTab,
    onTabChange,
    receivedCount,
}: FriendsSidebarProps) {
    return (
        <div className="p-4 sm:p-5 lg:pt-6">
            <div className="mb-6 px-1">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <RiCheckboxBlankCircleFill className="h-3 w-3 text-brand-500" />
                    Your people
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                    Keep your language community close.
                </p>
            </div>

            <nav className="space-y-1" aria-label="Friends sections">
                {tabs.map(({ id, label, description, icon: Icon }) => {
                    const active = selectedTab === id;
                    const count = id === "received" ? receivedCount : 0;

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onTabChange(id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                                active
                                    ? "bg-brand-500/12 text-brand-400"
                                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                            }`}
                        >
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    active
                                        ? "bg-brand-500 text-white"
                                        : "bg-surface-elevated text-text-muted"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    {label}
                                </span>
                                <span className="mt-0.5 block truncate text-xs text-text-muted">
                                    {description}
                                </span>
                            </span>
                            {count > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export function FriendsMobileTabs({
    selectedTab,
    onTabChange,
    receivedCount,
}: FriendsSidebarProps) {
    return (
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-surface p-4 pb-3 lg:hidden">
            {tabs.map(({ id, label }) => {
                const active = selectedTab === id;
                const count = id === "received" ? receivedCount : 0;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onTabChange(id)}
                        className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                            active
                                ? "bg-brand-500 text-white"
                                : "bg-surface-elevated text-text-secondary hover:bg-surface-hover"
                        }`}
                    >
                        {label}
                        {count > 0 && (
                            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${active ? "bg-white/20 text-white" : "bg-brand-500 text-white"}`}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
