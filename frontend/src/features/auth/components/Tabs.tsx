type TabsProps = {
    onClick: (action: "login" | "signup") => void;
    screen: "login" | "signup" | "forgotPassword";
};

const activeClasses: String = "text-brand-400 border-brand-500 border-b-2";
const inActiveClasses: String =
    "text-text-muted border-brand-500 hover:text-text-secondary transition-colors";

export default function Tabs({ onClick, screen }: TabsProps) {
    return (
        <div className="flex mb-8 border-b border-border">
            <button
                className={`cursor-pointer pb-3 px-4 font-medium text-sm ${screen === "login" ? activeClasses : inActiveClasses}`}
                onClick={() => onClick("login")}
            >
                Log in
            </button>
            <button
                className={`cursor-pointer pb-3 px-4 font-medium text-sm ${screen === "signup" ? activeClasses : inActiveClasses}`}
                onClick={() => onClick("signup")}
            >
                Sign up
            </button>
        </div>
    );
}
