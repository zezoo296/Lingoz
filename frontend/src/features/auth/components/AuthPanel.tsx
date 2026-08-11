import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import LoginFooter from "../components/LoginFooter";
import SignupFooter from "../components/SignupFooter";
import Tabs from "../components/Tabs";
import LoginHeader from "../components/LoginHeader";
import SignupHeader from "../components/SignupHeader";

type AuthScreen = "login" | "signup";

export default function AuthPanel() {
    const [screen, setScreen] = useState<AuthScreen>("login");
    const handleScreen = (newScreen: "login" | "signup") => {
        if (newScreen === screen) return;
        setScreen(newScreen);
    };

    return (
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center gap-y-5">
            {/* Tabs */}
            <Tabs screen={screen} onClick={handleScreen} />

            {screen === "login" ? <LoginHeader /> : <SignupHeader />}

            {screen === "login" ? <Login /> : <Signup />}

            {/* Divider */}
            <div className="relative flex items-center py-1">
                <div className="grow border-t border-border" />
                <span className="px-4 text-text-muted text-xs">
                    or continue with
                </span>
                <div className="grow border-t border-border" />
            </div>

            {/* Social */}
            <div className="space-y-3">
                <button
                    type="button"
                    className="cursor-pointer w-full bg-surface-elevated border border-border hover:border-border-hover rounded-xl py-3 flex items-center justify-center gap-3 text-text-primary text-sm font-medium transition-all"
                >
                    <FcGoogle className="w-5 h-5" />
                    Continue with Google
                </button>
            </div>

            {/* Footer */}
            {screen === "login" ? (
                <LoginFooter onClick={() => handleScreen("signup")} />
            ) : (
                <SignupFooter onClick={() => handleScreen("login")} />
            )}
        </div>
    );
}
