const suggestedUsers = [
    {
        name: "Lucía Fernández",
        languages: "Speaks Spanish, English",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        online: true,
    },
    {
        name: "Hiroshi Nakamura",
        languages: "Speaks Japanese, English",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        online: true,
    },
    {
        name: "Camille Dubois",
        languages: "Speaks French, English",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        online: true,
    },
    {
        name: "Arjun Patel",
        languages: "Speaks Hindi, English",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        online: true,
    },
];

export default function Suggested() {
    return (
        <div className="p-4 border-t border-border">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
                Suggested for you
            </p>
            <div className="space-y-3">
                {suggestedUsers.map((user) => (
                    <div key={user.name} className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <img
                                src={user.img}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {user.online && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-text-primary truncate">
                                    {user.name}
                                </span>
                                {user.online && (
                                    <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                                )}
                            </div>
                            <p className="text-xs text-text-muted truncate">
                                {user.languages}
                            </p>
                        </div>
                        <button className="px-3 py-1 rounded-lg bg-surface-elevated text-brand-500 text-xs font-medium hover:bg-surface-hover transition-colors border border-border shrink-0">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
