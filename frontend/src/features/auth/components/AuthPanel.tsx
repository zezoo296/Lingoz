import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import LoginFooter from "../components/LoginFooter";
import SignupFooter from "../components/SignupFooter";
import Tabs from "../components/Tabs";
import LoginHeader from "../components/LoginHeader";
import SignupHeader from "../components/SignupHeader";
import GoogleLoginButton from "./GoogleLogin";
import ForgotPassword from "./ForgotPassword";
import type { ForgotPasswordStep } from "./ForgotPasswordHeader";

type AuthScreen = "login" | "signup" | "forgotPassword";

export default function AuthPanel() {
    const [screen, setScreen] = useState<AuthScreen>("login");
    const [forgotPasswordStep, setForgotPasswordStep] =
        useState<ForgotPasswordStep>("email");

    const handleScreen = (newScreen: AuthScreen) => {
        if (newScreen === screen) return;
        setScreen(newScreen);
        if (newScreen === "forgotPassword") {
            setForgotPasswordStep("email");
        }
    };

    const showSocialLogin =
        screen !== "forgotPassword" || forgotPasswordStep === "email";

    return (
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center gap-y-5">
            {screen !== "forgotPassword" && (
                <Tabs screen={screen} onClick={handleScreen} />
            )}

            {screen === "login" ? (
                <LoginHeader />
            ) : screen === "signup" ? (
                <SignupHeader />
            ) : null}

            {screen === "login" ? (
                <Login onForgot={handleScreen} />
            ) : screen === "signup" ? (
                <Signup />
            ) : (
                <ForgotPassword
                    onBack={() => handleScreen("login")}
                    onStepChange={setForgotPasswordStep}
                />
            )}

            {showSocialLogin && (
                <>
                    <div className="relative flex items-center py-1">
                        <div className="grow border-t border-border" />
                        <span className="px-4 text-text-muted text-xs">
                            or continue with
                        </span>
                        <div className="grow border-t border-border" />
                    </div>

                    <GoogleLoginButton />
                </>
            )}

            {screen === "login" ? (
                <LoginFooter onClick={() => handleScreen("signup")} />
            ) : screen === "signup" ? (
                <SignupFooter onClick={() => handleScreen("login")} />
            ) : null}
        </div>
    );
}
