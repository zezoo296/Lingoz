import { RiChat3Line } from "react-icons/ri";

export default function NonActiveChats({onNewChat} : {
    onNewChat?: () => void
}) {
    return (
        <main className="flex-1 bg-background flex flex-col h-[calc(100vh-68.8px)] items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
            </div>
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-brand-500/10 flex items-center justify-center">
                    <RiChat3Line className="w-12 h-12 text-brand-500" />
                </div>
            </div>
            <div className="text-center max-w-md relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                    Choose a{" "}
                    <span className="text-brand-500">conversation</span>
                </h1>
                <p className="text-text-secondary text-sm sm:text-base mb-2">
                    Select a chat from the sidebar to continue
                </p>
                <p className="text-text-muted text-sm mb-8">
                    Or start a new conversation with someone new
                </p>
                <button
                    onClick={onNewChat}
                    className="px-6 py-3 rounded-xl bg-brand-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20 mx-auto"
                >
                    <RiChat3Line className="w-5 h-5" />
                    Start a new chat
                </button>
            </div>
        </main>
    );
}
