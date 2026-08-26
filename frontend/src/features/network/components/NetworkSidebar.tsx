import {
    RiArrowDownSLine,
    RiMapPinLine,
    RiCheckboxBlankCircleFill,
} from "react-icons/ri";
import type { UserQueryParams, UserStatus } from "@linguachat/shared";
import { countryOptions, languageOptions } from "../../../lib/nameCode";

interface NetworkSidebarProps {
    filters: UserQueryParams;
    onFiltersChange: (filters: UserQueryParams) => void;
    onApply: () => void;
    onReset: () => void;
}

export const NetworkSidebar = ({
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: NetworkSidebarProps) => {
    const updateFilter = <Key extends keyof UserQueryParams>(
        key: Key,
        value: UserQueryParams[Key],
    ) => {
        onFiltersChange({ ...filters, [key]: value || undefined });
    };

    return (
        <div className="space-y-6 p-4 sm:p-5">
            {/* Filters */}
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                        Filters
                    </h3>
                    <button
                        onClick={() => onFiltersChange({ status: "all" })}
                        className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    >
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
                    <div className="relative">
                        <select
                            value={filters.speak_language ?? ""}
                            onChange={(event) =>
                                updateFilter(
                                    "speak_language",
                                    event.target.value,
                                )
                            }
                            className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-secondary hover:border-border-hover transition-colors"
                        >
                            <option value="">Any language</option>
                            {languageOptions.map((language) => (
                                <option
                                    key={language.code}
                                    value={language.code}
                                >
                                    {language.name}
                                </option>
                            ))}
                        </select>
                        <RiArrowDownSLine className="pointer-events-none absolute right-3 top-1/2 w-5 h-5 -translate-y-1/2" />
                    </div>
                </div>

                {/* Learning language */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiCheckboxBlankCircleFill className="w-3 h-3 text-brand-500" />
                        <span className="text-sm font-medium">
                            Learning language
                        </span>
                    </div>
                    <div className="relative">
                        <select
                            value={filters.learn_language ?? ""}
                            onChange={(event) =>
                                updateFilter(
                                    "learn_language",
                                    event.target.value,
                                )
                            }
                            className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-secondary hover:border-border-hover transition-colors"
                        >
                            <option value="">Any language</option>
                            {languageOptions.map((language) => (
                                <option
                                    key={language.code}
                                    value={language.code}
                                >
                                    {language.name}
                                </option>
                            ))}
                        </select>
                        <RiArrowDownSLine className="pointer-events-none absolute right-3 top-1/2 w-5 h-5 -translate-y-1/2" />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <RiMapPinLine className="w-4 h-4 text-brand-500" />
                        <span className="text-sm font-medium">Location</span>
                    </div>
                    <div className="relative">
                        <select
                            value={filters.country ?? ""}
                            onChange={(event) =>
                                updateFilter("country", event.target.value)
                            }
                            className="w-full appearance-none px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-secondary hover:border-border-hover transition-colors"
                        >
                            <option value="">Any country</option>
                            {countryOptions.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <RiArrowDownSLine className="pointer-events-none absolute right-3 top-1/2 w-5 h-5 -translate-y-1/2" />
                    </div>
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
                                onClick={() =>
                                    updateFilter(
                                        "status",
                                        option.id as UserStatus,
                                    )
                                }
                                className="flex items-center gap-3 w-full group"
                            >
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        filters.status === option.id
                                            ? "border-brand-500 bg-brand-500"
                                            : "border-text-muted group-hover:border-text-secondary"
                                    }`}
                                >
                                    {filters.status === option.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                </div>
                                <span
                                    className={`text-sm ${
                                        filters.status === option.id
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
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-8">
                <button
                    onClick={onApply}
                    className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors"
                >
                    Apply filters
                </button>
                <button
                    onClick={onReset}
                    className="w-full py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-secondary transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
