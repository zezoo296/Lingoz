import { RiFilter3Line, RiSearchLine } from "react-icons/ri";

export default function SearchChats() {
    return (
        <div className="p-4 border-b border-border">
            <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all"
                />
                <RiFilter3Line className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted hover:text-text-secondary cursor-pointer transition-colors" />
            </div>
        </div>
    );
}
