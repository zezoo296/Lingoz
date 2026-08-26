// components/MessageTranslation.tsx

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
    RiTranslate,
    RiArrowGoBackLine,
    RiLoader4Line,
    RiSearchLine,
} from "react-icons/ri";
import {
    languageOptions,
    type LanguageCode,
    type LanguageName,
    getLanguageNameFromCode,
} from "../../../lib/nameCode";
import { translateMessage } from "../api/chatApi";

interface MessageTranslationProps {
    messageId: string;
    originalContent: string;
}

type TranslationState =
    | { status: "idle" }
    | { status: "loading"; targetLanguage: LanguageName }
    | {
          status: "translated";
          text: string;
          languageCode: LanguageCode;
      }
    | { status: "error"; error: string };

export const MessageTranslation = memo(function MessageTranslation({
    messageId,
    originalContent,
}: MessageTranslationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [translation, setTranslation] = useState<TranslationState>({
        status: "idle",
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Focus search input when menu opens
    useEffect(() => {
        if (!isOpen) return;

        requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });
    }, [isOpen]);

    const handleTranslate = useCallback(
        async (languageName: LanguageName, languageCode: LanguageCode) => {
            setIsOpen(false);
            setSearch("");

            setTranslation({
                status: "loading",
                targetLanguage: languageName,
            });

            try {
                const result = await translateMessage(messageId, languageCode);

                const translatedText = result?.data?.text;

                if (!translatedText || typeof translatedText !== "string") {
                    throw new Error("Invalid translation response");
                }

                setTranslation({
                    status: "translated",
                    text: translatedText,
                    languageCode,
                });
            } catch (err) {
                setTranslation({
                    status: "error",
                    error:
                        err instanceof Error
                            ? err.message
                            : "Translation failed",
                });
            }
        },
        [messageId],
    );

    const handleRevert = useCallback(() => {
        setTranslation({ status: "idle" });
    }, []);

    const toggleDropdown = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const filteredLanguages = languageOptions.filter(({ name }) =>
        name.toLowerCase().includes(search.toLowerCase().trim()),
    );

    // Translated state
    if (translation.status === "translated") {
        return (
            <div className="flex flex-col gap-1">
                <p>{translation.text}</p>

                <button
                    onClick={handleRevert}
                    className="
                        flex items-center gap-1
                        self-start
                        mt-0.5
                        text-[10px]
                        text-text-muted
                        hover:text-brand-400
                        transition-colors
                    "
                    title="Show original"
                >
                    <RiArrowGoBackLine className="w-3 h-3" />

                    <span>
                        Translated to{" "}
                        {getLanguageNameFromCode(translation.languageCode)} ·
                        Show original
                    </span>
                </button>
            </div>
        );
    }

    // Loading state
    if (translation.status === "loading") {
        return (
            <div className="flex items-center gap-2 text-text-muted">
                <RiLoader4Line className="w-4 h-4 animate-spin" />

                <span className="text-sm">
                    Translating to {translation.targetLanguage}...
                </span>
            </div>
        );
    }

    // Error state
    if (translation.status === "error") {
        return (
            <div className="flex flex-col gap-1">
                <p>{originalContent}</p>

                <span className="text-[10px] text-red-400">
                    {translation.error}
                </span>
            </div>
        );
    }

    // Default state
    return (
        <div className="relative group/message">
            <p>{originalContent}</p>

            {/* Translate button */}
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="
                    absolute
                    -right-7
                    top-0
                    p-1
                    rounded-md

                    text-text-muted
                    hover:text-brand-400
                    hover:bg-surface-elevated

                    transition-all

                    opacity-100
                    sm:opacity-0
                    sm:group-hover/message:opacity-100
                    sm:focus-visible:opacity-100
                "
                title="Translate message"
                aria-label="Translate message"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <RiTranslate className="w-4 h-4" />
            </button>

            {/* Language picker */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/20"
                        onClick={() => {
                            setIsOpen(false);
                            setSearch("");
                        }}
                    />

                    {/* Language picker */}
                    <div
                        ref={dropdownRef}
                        className="
                            fixed
                            z-50

                            left-3
                            right-3
                            bottom-3
                            sm:left-auto
                            sm:right-4
                            sm:bottom-4
                            sm:w-80

                            overflow-hidden

                            rounded-2xl
                            sm:rounded-2xl

                            bg-surface-elevated
                            border
                            border-border

                            shadow-2xl
                            shadow-black/25

                            fadeUp
                        "
                    >
                        {/* Header */}
                        <div className="px-3 py-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-center

                                        w-8
                                        h-8

                                        rounded-lg
                                        bg-brand-500/10
                                        text-brand-400
                                    "
                                >
                                    <RiTranslate className="w-4 h-4" />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-text-primary">
                                        Translate message
                                    </span>

                                    <span className="text-[11px] text-text-muted">
                                        Choose a language
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-3 py-2.5 border-b border-border">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2

                                    px-2.5
                                    py-2

                                    rounded-lg

                                    bg-surface
                                    border
                                    border-border

                                    focus-within:border-brand-500/50
                                    focus-within:ring-1
                                    focus-within:ring-brand-500/20
                                "
                            >
                                <RiSearchLine className="w-4 h-4 shrink-0 text-text-muted" />

                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={search}
                                    autoFocus={false}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search language..."
                                    className="
                                        w-full
                                        min-w-0

                                        bg-transparent
                                        outline-none

                                        text-sm
                                        text-text-primary

                                        placeholder:text-text-muted
                                    "
                                />
                            </div>
                        </div>

                        {/* Languages */}
                        <div
                            className="
                                max-h-[60vh]
                                sm:max-h-80

                                overflow-y-auto
                                py-1

                                scrollbar-thin
                                scrollbar-thumb-border
                                scrollbar-track-transparent
                            "
                        >
                            {filteredLanguages.length > 0 ? (
                                filteredLanguages.map(({ name, code }) => (
                                    <button
                                        key={code}
                                        onClick={() =>
                                            handleTranslate(name, code)
                                        }
                                        className="
                                            w-full

                                            flex
                                            items-center
                                            justify-between
                                            gap-3

                                            px-3
                                            py-2.5

                                            text-left

                                            hover:bg-brand-500/10
                                            active:bg-brand-500/15

                                            transition-colors
                                        "
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center

                                                    w-7
                                                    h-7
                                                    shrink-0

                                                    rounded-md

                                                    bg-surface
                                                    text-text-muted
                                                "
                                            >
                                                <RiTranslate className="w-3.5 h-3.5" />
                                            </div>

                                            <span className="text-sm text-text-primary truncate">
                                                {name}
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-[10px] font-medium uppercase text-text-muted">
                                            {code}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-7 text-center">
                                    <RiSearchLine className="mx-auto w-5 h-5 text-text-muted mb-2" />

                                    <p className="text-sm text-text-primary">
                                        No languages found
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-text-muted">
                                        Try another search
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});
