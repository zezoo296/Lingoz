import {
    RiSearchLine,
    RiArrowDownSLine,
    RiMapPinLine,
    RiEqualizerLine,
    RiCheckboxBlankCircleFill,
} from "react-icons/ri";

interface NetworkSidebarProps {
    onlineStatus: string;
    setOnlineStatus: (status: string) => void;
}

export const NetworkSidebar = ({
    onlineStatus,
    setOnlineStatus,
}: NetworkSidebarProps) => {
    return (
        <div className="space-y-6 p-4 sm:p-5">
            {/* Filters */}
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                        Filters
                    </h3>
                    <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                        Clear all
                    </button>
                </div>

                {/* Language spoken */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiCheckboxBlankCircleFill className="w-3 h-3 text-brand-500" />
                        <span className="text-sm font-medium">
                            Language spoken
                        </span>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-muted hover:border-border-hover transition-colors">
                        <span>Any language</span>
                        <RiArrowDownSLine className="w-5 h-5" />
                    </button>
                </div>

                {/* Learning language */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiCheckboxBlankCircleFill className="w-3 h-3 text-brand-500" />
                        <span className="text-sm font-medium">
                            Learning language
                        </span>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-muted hover:border-border-hover transition-colors">
                        <span>Any language</span>
                        <RiArrowDownSLine className="w-5 h-5" />
                    </button>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiMapPinLine className="w-4 h-4 text-brand-500" />
                        <span className="text-sm font-medium">Location</span>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-muted hover:border-border-hover transition-colors">
                        <span>Any country</span>
                        <RiArrowDownSLine className="w-5 h-5" />
                    </button>
                </div>

                {/* Online status */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm font-medium">
                            Online status
                        </span>
                    </div>
                    <div className="space-y-2.5">
                        {[
                            { id: "all", label: "All" },
                            {
                                id: "online",
                                label: "Online now",
                            },
                            {
                                id: "recent",
                                label: "Recently active",
                            },
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setOnlineStatus(option.id)}
                                className="flex items-center gap-3 w-full group"
                            >
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        onlineStatus === option.id
                                            ? "border-brand-500 bg-brand-500"
                                            : "border-text-muted group-hover:border-text-secondary"
                                    }`}
                                >
                                    {onlineStatus === option.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                </div>
                                <span
                                    className={`text-sm ${
                                        onlineStatus === option.id
                                            ? "text-text-primary"
                                            : "text-text-muted group-hover:text-text-secondary"
                                    }`}
                                >
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort by */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiEqualizerLine className="w-4 h-4 text-brand-500" />
                        <span className="text-sm font-medium">Sort by</span>
                    </div>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-muted hover:border-border-hover transition-colors">
                        <span>Recently active</span>
                        <RiArrowDownSLine className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
                <button className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors">
                    Apply filters
                </button>
                <button className="w-full py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-secondary transition-colors">
                    Reset
                </button>
            </div>
        </div>
    );
};
