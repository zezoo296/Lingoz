import {
    HiOutlineEyeOff,
    HiOutlineLockClosed,
    HiOutlineMail,
} from "react-icons/hi";

export default function Signup() {
    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="fadeLeft space-y-5"
        >
            {/* Email */}
            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Name
                </label>
                <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Email
                </label>
                <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Password
                </label>
                <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-11 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all"
                    />
                    <button
                        type="button"
                        className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                        <HiOutlineEyeOff className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20"
            >
                Sign up
            </button>
        </form>
    );
}
