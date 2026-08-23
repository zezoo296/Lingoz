import { RiSearchLine } from "react-icons/ri";

type SearchChatsProps = {
    searchQuery: string;
    onSearchChange: (query: string) => void;
};

export default function SearchChats({
    searchQuery,
    onSearchChange,
}: SearchChatsProps) {
    return (
        <div className="p-4 border-b border-border">
            <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all"
                />
            </div>
        </div>
    );
}
