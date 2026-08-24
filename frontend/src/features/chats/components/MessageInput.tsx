// components/MessageInput.tsx
import { useCallback, useRef, useState } from "react";
import { RiSparkling2Line } from "react-icons/ri";

interface MessageInputProps {
    chatName: string;
    onSend: (message: string) => void;
    disabled?: boolean;
    suggestions?: string[];
}

export function MessageInput({
    chatName,
    onSend,
    disabled,
    suggestions = [],
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
            <div className="max-w-4xl mx-auto space-y-2">
                {suggestions.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border bg-surface-elevated/90 p-2 shadow-lg shadow-black/5 fadeUp w-fit max-w-full mx-auto">
                        <RiSparkling2Line className="w-4 h-4 shrink-0 text-brand-500" />
                        <div className="flex gap-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => {
                                        setValue(suggestion);
                                        inputRef.current?.focus();
                                    }}
                                    disabled={disabled}
                                    className="shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-left text-xs text-text-primary transition-colors hover:border-brand-500 hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
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
        </div>
    );
}
