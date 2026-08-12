import {
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineKey,
    HiOutlineLockClosed,
    HiOutlineMail,
} from "react-icons/hi";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
    forgotPassword,
    verifyResetOtp,
    resetPassword,
} from "../api/authApi";
import {
    forgotPasswordSchema,
    verifyResetOtpSchema,
    resetPasswordFormSchema,
    type ForgotPasswordInput,
    type VerifyResetOtpInput,
    type ResetPasswordFormInput,
} from "@linguachat/shared";
import ForgotPasswordHeader, {
    type ForgotPasswordStep,
} from "./ForgotPasswordHeader";

type ForgotPasswordProps = {
    onBack: () => void;
    onStepChange: (step: ForgotPasswordStep) => void;
};

export default function ForgotPassword({
    onBack,
    onStepChange,
}: ForgotPasswordProps) {
    const [step, setStep] = useState<ForgotPasswordStep>("email");
    const [email, setEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const goToStep = (nextStep: ForgotPasswordStep) => {
        setStep(nextStep);
        onStepChange(nextStep);
    };

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message);
            goToStep("otp");
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: verifyResetOtp,
        onSuccess: (data) => {
            setResetToken(data.data.resetToken);
            passwordForm.setValue("resetToken", data.data.resetToken);
            toast.success(data.message);
            goToStep("password");
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            toast.success(data.message);
            goToStep("success");
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const emailForm = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onTouched",
        defaultValues: { email },
    });

    const otpForm = useForm<VerifyResetOtpInput>({
        resolver: zodResolver(verifyResetOtpSchema),
        mode: "onTouched",
        defaultValues: { email, otp: "" },
    });

    const passwordForm = useForm<ResetPasswordFormInput>({
        resolver: zodResolver(resetPasswordFormSchema),
        mode: "onTouched",
        defaultValues: {
            resetToken,
            password: "",
            confirmPassword: "",
        },
    });

    const onEmailSubmit = (data: ForgotPasswordInput) => {
        const normalizedEmail = data.email.trim().toLowerCase();
        setEmail(normalizedEmail);
        otpForm.setValue("email", normalizedEmail);
        forgotPasswordMutation.mutate({ email: normalizedEmail });
    };

    const onOtpSubmit = (data: VerifyResetOtpInput) => {
        verifyOtpMutation.mutate({
            email,
            otp: data.otp,
        });
    };

    const onPasswordSubmit = (data: ResetPasswordFormInput) => {
        resetPasswordMutation.mutate({
            resetToken: data.resetToken,
            password: data.password,
        });
    };

    const handleResendCode = () => {
        forgotPasswordMutation.mutate(
            { email },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                },
            },
        );
    };

    const isPending =
        forgotPasswordMutation.isPending ||
        verifyOtpMutation.isPending ||
        resetPasswordMutation.isPending;

    if (step === "success") {
        return (
            <div className="fade space-y-5">
                <ForgotPasswordHeader step="success" />
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20"
                >
                    Back to login
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <ForgotPasswordHeader step={step} />

            {step === "email" && (
                <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="fade space-y-5"
                >
                    <div>
                        <label className="block text-text-primary text-sm font-medium mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...emailForm.register("email")}
                                disabled={isPending}
                                className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                                aria-invalid={Boolean(emailForm.formState.errors.email)}
                            />
                        </div>
                        {emailForm.formState.errors.email && (
                            <p className="mt-2 text-sm text-error">
                                {emailForm.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {forgotPasswordMutation.isPending
                            ? "Sending code..."
                            : "Send reset code"}
                    </button>
                </form>
            )}

            {step === "otp" && (
                <form
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="fade space-y-5"
                >
                    <div>
                        <label className="block text-text-primary text-sm font-medium mb-2">
                            Verification code
                        </label>
                        <div className="relative">
                            <HiOutlineKey className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="123456"
                                {...otpForm.register("otp")}
                                disabled={isPending}
                                className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm tracking-[0.3em] placeholder:tracking-normal placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                                aria-invalid={Boolean(otpForm.formState.errors.otp)}
                            />
                        </div>
                        {otpForm.formState.errors.otp && (
                            <p className="mt-2 text-sm text-error">
                                {otpForm.formState.errors.otp.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {verifyOtpMutation.isPending
                            ? "Verifying..."
                            : "Verify code"}
                    </button>

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleResendCode}
                        className="cursor-pointer w-full text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors disabled:opacity-60"
                    >
                        Resend code
                    </button>
                </form>
            )}

            {step === "password" && (
                <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="fade space-y-5"
                >
                    <div>
                        <label className="block text-text-primary text-sm font-medium mb-2">
                            New password
                        </label>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                {...passwordForm.register("password")}
                                disabled={isPending}
                                className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-11 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                                aria-invalid={Boolean(
                                    passwordForm.formState.errors.password,
                                )}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <HiOutlineEyeOff className="w-4 h-4" />
                                ) : (
                                    <HiOutlineEye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {passwordForm.formState.errors.password && (
                            <p className="mt-2 text-sm text-error">
                                {passwordForm.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-text-primary text-sm font-medium mb-2">
                            Confirm password
                        </label>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                {...passwordForm.register("confirmPassword")}
                                disabled={isPending}
                                className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-11 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                                aria-invalid={Boolean(
                                    passwordForm.formState.errors.confirmPassword,
                                )}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((value) => !value)
                                }
                                className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <HiOutlineEyeOff className="w-4 h-4" />
                                ) : (
                                    <HiOutlineEye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {passwordForm.formState.errors.confirmPassword && (
                            <p className="mt-2 text-sm text-error">
                                {
                                    passwordForm.formState.errors.confirmPassword
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {resetPasswordMutation.isPending
                            ? "Resetting password..."
                            : "Reset password"}
                    </button>
                </form>
            )}

            <button
                type="button"
                onClick={onBack}
                disabled={isPending}
                className="cursor-pointer w-full text-text-secondary hover:text-text-primary text-sm transition-colors disabled:opacity-60"
            >
                Back to login
            </button>
        </div>
    );
}
