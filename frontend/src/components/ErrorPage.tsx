import Header from "./Header";
import { useNavigate } from "react-router";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-dvh bg-background flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden fade">
                {/* Background glow effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-75 h-75 bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Main content */}
                <div className="relative z-10 text-center max-w-lg w-full">
                    {/* 404 with gradient */}
                    <h1 className="text-[120px] font-bold leading-none tracking-tighter bg-linear-to-b from-text-primary to-brand-600/40 bg-clip-text text-transparent select-none mb-2">
                        404
                    </h1>

                    {/* Status badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-600/20 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                        <span className="text-xs font-medium text-brand-300 uppercase tracking-wider">
                            Page Not Found
                        </span>
                    </div>

                    {/* Message */}
                    <h2 className="text-2xl font-semibold text-text-primary mb-3">
                        Lost in the void?
                    </h2>
                    <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-sm mx-auto">
                        The page you're looking for doesn't exist or has been
                        moved to another dimension.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="group px-6 py-2.5 rounded-lg bg-brand-600 text-text-primary font-medium text-sm transition-all duration-200 hover:bg-brand-500 hover:shadow-[0_0_20px_rgba(109,61,240,0.3)] active:scale-[0.98]"
                        >
                            <span className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Go Back
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2.5 rounded-lg border border-border text-text-secondary font-medium text-sm transition-all duration-200 hover:border-border-hover hover:text-text-primary hover:bg-surface"
                        >
                            Return Home
                        </button>
                    </div>
                </div>

                {/* Footer hint */}
                <div className="absolute bottom-6 text-text-disabled text-xs">
                    Error Code:{" "}
                    <span className="font-mono text-text-muted">
                        404_NOT_FOUND
                    </span>
                </div>
            </div>
        </div>
    );
}
