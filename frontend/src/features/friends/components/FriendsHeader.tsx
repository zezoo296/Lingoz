import { RiCompass3Line, RiUserAddLine, RiUserReceivedLine, RiUserSharedLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import type { FriendsTab } from "./FriendsSidebar";

const copy: Record<FriendsTab, { title: string; description: string; icon: typeof RiUserSharedLine }> = {
    connections: {
        title: "Your connections",
        description: "The people you are learning languages with.",
        icon: RiUserSharedLine,
    },
    sent: {
        title: "Sent requests",
        description: "Connection requests waiting for a response.",
        icon: RiUserAddLine,
    },
    received: {
        title: "Received requests",
        description: "Respond to people who want to learn with you.",
        icon: RiUserReceivedLine,
    },
};

export function FriendsHeader({ tab }: { tab: FriendsTab }) {
    const navigate = useNavigate();
    const { title, description, icon: Icon } = copy[tab];

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between fadeDown">
            <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/12 text-brand-400">
                    <Icon className="h-5 w-5" />
                </span>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                    <p className="mt-1 text-sm text-text-muted">{description}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => navigate("/network", { viewTransition: true })}
                className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-500"
            >
                <RiCompass3Line className="h-5 w-5" />
                Find people
            </button>
        </div>
    );
}
