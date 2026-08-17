import { FaEarthAmericas } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { IoTrophy } from "react-icons/io5";
import { MdTranslate } from "react-icons/md";
import { RiChat1Line, RiTeamLine } from "react-icons/ri";
const featureCards = [
    {
        icon: <HiUsers className="w-5 h-5 text-brand-500" />,
        title: "Find partners",
        desc: "Connect with native speakers",
    },
    {
        icon: <MdTranslate className="w-5 h-5 text-accent-green" />,
        title: "Practice languages",
        desc: "Chat and improve your speaking skills",
    },
    {
        icon: <FaEarthAmericas className="w-5 h-5 text-accent-blue" />,
        title: "Explore cultures",
        desc: "Learn about different cultures and traditions",
    },
    {
        icon: <IoTrophy className="w-5 h-5 text-accent-yellow" />,
        title: "Track progress",
        desc: "Stay motivated and reach your goals",
    },
];


export default function MainAreaEmptyChats() {
    return (
        <main className="flex-1 bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
            </div>

            {/* Hero Illustration */}
            <div className="relative mb-8">
                <div className="flex items-center justify-center gap-4">
                    {/* Avatar Left */}
                    <div className="w-14 h-14 rounded-full border-2 border-border overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Center Chat Bubble */}
                    <div className="relative">
                        <div className="w-20 h-16 bg-brand-500 rounded-2xl rounded-bl-sm flex items-center justify-center shadow-lg shadow-brand-500/30">
                            <div className="flex gap-1.5">
                                <span
                                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                />
                                <span
                                    className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Avatar Right */}
                    <div className="w-14 h-14 rounded-full border-2 border-border overflow-hidden shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                {/* Top/Bottom Avatar */}
                <div className="absolute -bottom-15 lg:-top-15 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-border overflow-hidden shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Text Content */}
            <div className="text-center max-w-md relative z-10 mt-6 lg:mt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                    Your <span className="text-brand-500">conversations</span>{" "}
                    will appear here
                </h1>
                <p className="text-text-secondary text-sm sm:text-base mb-2">
                    You don't have any conversations yet.
                </p>
                <p className="text-text-muted text-sm mb-8">
                    Start a new chat or connect with learners from around the
                    world.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20">
                        <RiChat1Line className="w-5 h-5" />
                        Start a new chat
                    </button>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border text-text-secondary font-medium flex items-center justify-center gap-2 hover:bg-surface-elevated hover:text-text-primary transition-all">
                        <RiTeamLine className="w-5 h-5" />
                        Explore people
                    </button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl relative z-10">
                {featureCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-surface border border-border rounded-xl p-4 hover:border-border-hover transition-colors"
                    >
                        <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center mb-3">
                            {card.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-text-primary mb-1">
                            {card.title}
                        </h4>
                        <p className="text-xs text-text-muted">{card.desc}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
