import { IoChatbubblesOutline } from "react-icons/io5";
import { ImQuotesLeft } from "react-icons/im";


export default function Welcome() {
    return (
        <div className="relative w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background/80 to-transparent" />
            </div>

            <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                        <IoChatbubblesOutline className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-text-primary">
                        Lingoz
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-3">
                    Practice <span className="text-brand-400">languages.</span>
                    <br />
                    Connect <span className="text-brand-400">cultures.</span>
                </h1>
                <p className="text-text-secondary text-base leading-relaxed mb-10">
                    Chat with native speakers,
                    <br />
                    learn together and
                    <br />
                    grow every day.
                </p>

                {/* Globe & Avatars */}
                <div className="relative w-56 h-56 mx-auto mb-6 pop-out">
                    <div className="absolute inset-0 rounded-full border border-brand-600/20 bg-brand-900/10 flex items-center justify-center">
                        <svg
                            className="w-40 h-40 text-brand-600/30"
                            viewBox="0 0 100 100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        >
                            <circle cx="50" cy="50" r="45" />
                            <ellipse cx="50" cy="50" rx="20" ry="45" />
                            <ellipse cx="50" cy="50" rx="35" ry="45" />
                            <line x1="5" y1="50" x2="95" y2="50" />
                            <line x1="50" y1="5" x2="50" y2="95" />
                            <path d="M15 25 Q50 15 85 25" />
                            <path d="M15 75 Q50 85 85 75" />
                        </svg>
                    </div>

                    {/* Avatar 1 */}
                    <div className="absolute top-2 left-4">
                        <div className="bg-chat-other border border-chat-other-border rounded-xl px-3 py-1.5 text-xs text-accent-green font-medium mb-1.5 shadow-sm">
                            ¡Hola!
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                    </div>

                    {/* Avatar 2 */}
                    <div className="absolute top-8 right-2">
                        <div className="bg-chat-other border border-chat-other-border rounded-xl px-3 py-1.5 text-xs text-accent-blue font-medium mb-1.5 shadow-sm">
                            Bonjour!
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                    </div>

                    {/* Avatar 3 */}
                    <div className="absolute bottom-10 left-0">
                        <div className="bg-chat-other border border-chat-other-border rounded-xl px-3 py-1.5 text-xs text-accent-yellow font-medium mb-1.5 shadow-sm">
                            你好!
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                    </div>

                    {/* Avatar 4 */}
                    <div className="absolute bottom-4 right-6">
                        <div className="bg-chat-other border border-chat-other-border rounded-xl px-3 py-1.5 text-xs text-accent-pink font-medium mb-1.5 shadow-sm">
                            Hello!
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                    </div>
                </div>
            </div>

            {/* Quote */}
            <div className="relative z-10 mt-auto pt-6">
                <div className="flex gap-2">
                    <ImQuotesLeft className="w-6 h-6 text-brand-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-text-secondary text-sm italic leading-relaxed">
                            A different language is a different vision of life.
                        </p>
                        <p className="text-text-muted text-xs mt-2">
                            — Federico Fellini
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
