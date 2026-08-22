// components/DateDivider.tsx
import { memo } from "react";
import { formatDateDivider } from "../lib/helpers";

interface DateDividerProps {
    date: Date;
}

export const DateDivider = memo(function DateDivider({
    date,
}: DateDividerProps) {
    return (
        <div className="flex items-center justify-center my-4">
            <div className="px-3 py-1 rounded-full bg-surface-elevated border border-border">
                <span className="text-xs text-text-muted font-medium">
                    {formatDateDivider(date)}
                </span>
            </div>
        </div>
    );
});
