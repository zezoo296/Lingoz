type ActionButtonProps = {
    isSaving?: boolean;
    onReset: () => void;
};

export default function ActionButton({ isSaving = false, onReset }: ActionButtonProps) {
    return (
        <div className="flex gap-3">
            <button
                type="button"
                disabled={isSaving}
                onClick={onReset}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-surface-hover transition-colors"
            >
                Reset
            </button>
            <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
