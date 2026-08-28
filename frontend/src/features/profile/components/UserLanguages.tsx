import { useEffect, useState } from "react";
import {
    RiAddLine,
    RiCheckLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiDraggable,
    RiSaveLine,
} from "react-icons/ri";
import type { UpdateUserLanguagesInput } from "@linguachat/shared";
import {
    getLanguageNameFromCode,
    languageOptions,
    type LanguageCode,
} from "../../../lib/nameCode";

type UserLanguage = UpdateUserLanguagesInput["userLanguages"][number];

type UserLanguagesProps = {
    userLanguages: UserLanguage[];
    isSaving?: boolean;
    onSave: (userLanguages: UserLanguage[]) => void;
};

type LanguageStatus = "speaking" | "learning" | "both";

const statusValues: Record<LanguageStatus, Pick<UserLanguage, "isLearning" | "isSpeaking">> = {
    speaking: { isSpeaking: true, isLearning: false },
    learning: { isSpeaking: false, isLearning: true },
    both: { isSpeaking: true, isLearning: true },
};

export default function UserLanguages({
    userLanguages,
    isSaving = false,
    onSave,
}: UserLanguagesProps) {
    const [draftLanguages, setDraftLanguages] = useState(userLanguages);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedCode, setSelectedCode] = useState<LanguageCode>();
    const [selectedStatus, setSelectedStatus] = useState<LanguageStatus>("speaking");

    useEffect(() => setDraftLanguages(userLanguages), [userLanguages]);

    const availableLanguages = languageOptions.filter(
        ({ code }) => !draftLanguages.some((language) => language.languageCode === code),
    );

    const addLanguage = () => {
        if (!selectedCode) return;

        setDraftLanguages((languages) => [
            ...languages,
            { languageCode: selectedCode, ...statusValues[selectedStatus] },
        ]);
        setSelectedCode(undefined);
        setSelectedStatus("speaking");
        setIsAdding(false);
    };

    const toggleStatus = (languageCode: string, status: "isSpeaking" | "isLearning") => {
        setDraftLanguages((languages) =>
            languages.map((language) =>
                language.languageCode === languageCode
                    ? { ...language, [status]: !language[status] }
                    : language,
            ),
        );
    };

    const removeLanguage = (languageCode: string) => {
        setDraftLanguages((languages) =>
            languages.filter((language) => language.languageCode !== languageCode),
        );
    };

    return (
        <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-text-primary font-medium">Languages</h3>
                    <p className="text-text-muted text-sm mt-0.5">
                        Add the languages you speak or are learning.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsAdding((open) => !open)}
                        disabled={availableLanguages.length === 0 || isSaving}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-brand-500 text-brand-500 text-sm hover:bg-brand-500/10 transition-colors disabled:opacity-50"
                    >
                        {isAdding ? <RiCloseLine className="w-4 h-4" /> : <RiAddLine className="w-4 h-4" />}
                        {isAdding ? "Cancel" : "Add Language"}
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(draftLanguages)}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <RiSaveLine className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Languages"}
                    </button>
                </div>
            </div>

            {isAdding ? (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-2 p-3 rounded-lg border border-border bg-background-secondary">
                    <select
                        value={selectedCode ?? ""}
                        onChange={(event) => setSelectedCode(event.target.value as LanguageCode)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-500"
                    >
                        <option value="">Select a language</option>
                        {availableLanguages.map(({ code, name }) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value as LanguageStatus)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-500"
                    >
                        <option value="speaking">I speak</option>
                        <option value="learning">I'm learning</option>
                        <option value="both">Both</option>
                    </select>
                    <button
                        type="button"
                        onClick={addLanguage}
                        disabled={!selectedCode}
                        className="px-3 py-2 rounded-lg border border-brand-500 text-brand-500 text-sm disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
            ) : null}

            <div className="border border-border rounded-lg overflow-hidden">
                {draftLanguages.length ? (
                    <>
                        <div className="hidden sm:flex items-center px-4 py-2.5 bg-background-secondary border-b border-border text-xs text-text-muted">
                            <span className="flex-1">Language</span>
                            <span className="w-24 text-center">I speak</span>
                            <span className="w-24 text-center">I'm learning</span>
                            <span className="w-10" />
                        </div>
                        {draftLanguages.map((language) => (
                            <div key={language.languageCode} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 px-4 py-3 border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <RiDraggable className="w-4 h-4 text-text-muted cursor-grab hidden sm:block" />
                                    <span className="text-sm text-text-primary font-medium">
                                        {getLanguageNameFromCode(language.languageCode as LanguageCode)}
                                    </span>
                                </div>
                                <StatusButton label="I speak" active={language.isSpeaking} onClick={() => toggleStatus(language.languageCode, "isSpeaking")} />
                                <StatusButton label="I'm learning" active={language.isLearning} onClick={() => toggleStatus(language.languageCode, "isLearning")} />
                                <button type="button" onClick={() => removeLanguage(language.languageCode)} disabled={isSaving} className="w-10 flex justify-center text-text-muted hover:text-error transition-colors disabled:opacity-50" aria-label={`Remove ${language.languageCode}`}>
                                    <RiDeleteBinLine className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="px-4 py-6 text-sm text-text-muted">No languages added yet.</div>
                )}
            </div>
        </div>
    );
}

function StatusButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center justify-between sm:justify-center gap-2 sm:w-24 text-left sm:text-center" aria-label={label}>
            <span className="sm:hidden text-xs text-text-muted">{label}</span>
            <span className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${active ? "bg-brand-500 border border-brand-500" : "bg-background-secondary border border-border-hover"}`}>
                {active ? <RiCheckLine className="w-3.5 h-3.5 text-white" /> : null}
            </span>
        </button>
    );
}
