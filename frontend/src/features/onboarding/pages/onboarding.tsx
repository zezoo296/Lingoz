import {
    RiChat1Line,
    RiTeamLine,
    RiUserLine,
    RiRocketLine,
    RiTranslate,
    RiChatNewLine,
    RiGlobalLine,
    RiBookOpenLine,
    RiStarFill,
    RiCheckLine,
    RiArrowRightSLine,
    RiArrowRightLine,
} from "react-icons/ri";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

export default function Onboarding() {
    const bgImage = "/images/earth.avif";
    const { data: currentUser } = useCurrentUser();
    return (
        <div className="min-h-screen bg-background text-text-primary font-sans relative overflow-hidden">
            {/* Earth Background Layer */}
            <div
                className="absolute top-10 md:right-0 -right-8 z-0 pointer-events-none bg-top-right bg-no-repeat"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "contain",
                    width: "800px",
                    height: "800px",
                    opacity: 0.5,
                    animation: "spinEarth 5s linear infinite alternate",
                }}
            />
            {/* Optional: dark overlay gradient so text stays readable */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-linear-to-b from-background/60 via-transparent to-background/80" />

            {/* Main Content */}
            <main className="relative z-10 max-w-360 mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                {/* Hero */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8 sm:mb-10 fadeRight">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                            Welcome to Lingoz,{" "}
                            <span className="text-brand-500">
                                {currentUser?.name?.split(" ")[0]}!
                            </span>{" "}
                            👋
                        </h1>
                        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl">
                            Let's help you practice languages, connect with
                            amazing people, and make the world your classroom.
                        </p>
                    </div>
                </div>

                {/* Onboarding Card */}
                <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 fadeUp">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center shrink-0">
                                <RiRocketLine className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold">
                                    Let's get you started! 🚀
                                </h2>
                                <p className="text-xs sm:text-sm text-text-muted">
                                    Complete these steps to unlock the full
                                    Lingoz experience.
                                </p>
                            </div>
                        </div>
                        <div className="sm:text-right shrink-0">
                            <span className="text-sm text-text-secondary">
                                1 / 4 completed
                            </span>
                            <div className="w-full sm:w-32 h-1.5 bg-surface-active rounded-full mt-2 overflow-hidden">
                                <div className="w-1/4 h-full bg-brand-500 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Step 1 */}
                        <div className="relative bg-surface-elevated border border-brand-500 rounded-xl p-5">
                            <div className="absolute top-3 right-3 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                                <RiCheckLine className="w-3 h-3 text-white" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiUserLine className="w-5 h-5 text-brand-500" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                1. Complete your profile
                            </h3>
                            <p className="text-xs text-text-muted mb-3">
                                Tell us a bit about yourself
                            </p>
                            <button className="text-xs text-brand-500 font-medium hover:underline">
                                Get started →
                            </button>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-surface-elevated border border-border rounded-xl p-5 group hover:border-border-hover transition-colors">
                            <div className="absolute top-3 right-3 text-text-muted">
                                <RiArrowRightSLine className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiTranslate className="w-5 h-5 text-text-muted" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                2. Add your languages
                            </h3>
                            <p className="text-xs text-text-muted mb-3">
                                Select the languages you speak and want to learn
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-surface-elevated border border-border rounded-xl p-5 group hover:border-border-hover transition-colors">
                            <div className="absolute top-3 right-3 text-text-muted">
                                <RiArrowRightSLine className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiTeamLine className="w-5 h-5 text-text-muted" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                3. Find your first partner
                            </h3>
                            <p className="text-xs text-text-muted mb-3">
                                Connect with native speakers and start
                                practicing
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative bg-surface-elevated border border-border rounded-xl p-5 group hover:border-border-hover transition-colors">
                            <div className="absolute top-3 right-3 text-text-muted">
                                <RiArrowRightSLine className="w-4 h-4" />
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiChatNewLine className="w-5 h-5 text-text-muted" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                4. Start a conversation
                            </h3>
                            <p className="text-xs text-text-muted mb-3">
                                Break the ice and send your first message
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Lingoz */}
                <div className="mb-8 sm:mb-10 fade">
                    <h2 className="text-lg font-semibold mb-5">Why Lingoz?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Practice naturally */}
                        <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-border-hover transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiChat1Line className="w-5 h-5 text-brand-500" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                Practice naturally
                            </h3>
                            <p className="text-xs text-text-muted mb-4">
                                Have real conversations with native speakers.
                            </p>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent-pink to-error-dark border-2 border-surface" />
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent-blue to-sky-500 border-2 border-surface" />
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent-green to-emerald-600 border-2 border-surface" />
                            </div>
                        </div>

                        {/* Explore cultures */}
                        <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-border-hover transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiGlobalLine className="w-5 h-5 text-accent-green" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                Explore cultures
                            </h3>
                            <p className="text-xs text-text-muted mb-4">
                                Learn about different cultures and perspectives.
                            </p>
                            <div className="flex gap-1.5 flex-wrap">
                                {["ES", "JP", "FR", "BR", "KR"].map((code) => (
                                    <div
                                        key={code}
                                        className="w-6 h-6 rounded-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center text-xs font-bold text-white"
                                    >
                                        {code}
                                    </div>
                                ))}
                                <div className="w-6 h-6 rounded-full bg-surface-active flex items-center justify-center text-xs text-text-muted">
                                    +
                                </div>
                            </div>
                        </div>

                        {/* Improve every day */}
                        <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-border-hover transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiBookOpenLine className="w-5 h-5 text-accent-blue" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                Improve every day
                            </h3>
                            <p className="text-xs text-text-muted mb-4">
                                Track your progress and stay motivated.
                            </p>
                            <div className="flex items-end gap-1 h-8">
                                {[30, 45, 35, 55, 50, 70, 85, 100].map(
                                    (h, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 rounded-t ${i >= 6 ? "bg-brand-500" : "bg-surface-active"}`}
                                            style={{ height: `${h}%` }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Earn achievements */}
                        <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-xl p-5 hover:border-border-hover transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-surface-active flex items-center justify-center mb-4">
                                <RiStarFill className="w-5 h-5 text-accent-yellow" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">
                                Earn achievements
                            </h3>
                            <p className="text-xs text-text-muted mb-4">
                                Unlock badges and celebrate your milestones.
                            </p>
                            <div className="flex gap-2">
                                {[
                                    "from-accent-yellow to-warning-dark",
                                    "from-purple-500 to-violet-600",
                                    "from-success to-success-dark",
                                    "from-accent-blue to-sky-500",
                                ].map((grad, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-lg bg-linear-to-br ${grad} flex items-center justify-center`}
                                    >
                                        <RiStarFill className="w-4 h-4 text-white" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-3">
                    <button className="w-full sm:w-auto px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                        Complete your profile
                        <RiArrowRightLine className="w-4 h-4" />
                    </button>
                    <button className="text-sm text-text-muted hover:text-text-secondary transition-colors">
                        Maybe later
                    </button>
                </div>
            </main>
        </div>
    );
}
