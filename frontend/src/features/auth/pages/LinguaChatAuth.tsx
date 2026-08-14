import AuthPanel from "../components/AuthPanel";
import Welcome from "../components/Welcome";

export default function LinguaChatAuth() {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-240 bg-surface rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row">
                {/* ─── Left Panel ─── */}
                <Welcome />

                {/* ─── Right Panel ─── */}
                <AuthPanel />
            </div>
        </div>
    );
}
