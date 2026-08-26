import { useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";

interface NetworkSearchProps {
    value: string;
    onChange: (search: string) => void;
    onDebouncedSearchChange: (search: string) => void;
}

export default function NetworkSearch({
    value,
    onChange,
    onDebouncedSearchChange,
}: NetworkSearchProps) {
    useEffect(() => {
        const timeout = window.setTimeout(() => {
            onDebouncedSearchChange(value.trim());
        }, 500);

        return () => window.clearTimeout(timeout);
    }, [value, onDebouncedSearchChange]);

    return (
        <div className="border-b border-border pb-5">
            <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search by username..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted border border-border rounded px-1.5 py-0.5">
                    /
                </span>
            </div>
        </div>
    );
}
