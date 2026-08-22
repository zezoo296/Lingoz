// components/MessageInput.tsx
import { useCallback, useRef, useState } from "react";

interface MessageInputProps {
    chatName: string;
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function MessageInput({
    chatName,
    onSend,
    disabled,
}: MessageInputProps) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = useCallback(() => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        inputRef.current?.focus();
    }, [value, disabled, onSend]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit],
    );

    return (
        <div className="p-3 sm:p-4 border-t border-border bg-surface/50">
            <div className="max-w-4xl mx-auto flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${chatName || "..."}`}
                    disabled={disabled}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
                />
                <button
                    onClick={handleSubmit}
                    disabled={disabled || !value.trim()}
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
