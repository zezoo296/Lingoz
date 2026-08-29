import {
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineLockClosed,
    HiOutlineMail,
} from "react-icons/hi";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { login } from "../api/authApi";
import { loginSchema, type LoginInput } from "@linguachat/shared";
import { useNavigate } from "react-router";

type loginProps = {
    onForgot: (action: "forgotPassword") => void;
};

export default function Login({ onForgot }: loginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success("Logged in successfully!");
            navigate("/profile", { viewTransition: true });
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    const onSubmit = (data: LoginInput) => mutation.mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="fadeRight space-y-5">
            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Email
                </label>
                <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        disabled={mutation.isPending}
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                        aria-invalid={Boolean(errors.email)}
                    />
                </div>
                {errors.email && (
                    <p className="mt-2 text-sm text-error">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Password
                </label>
                <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        disabled={mutation.isPending}
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-11 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                        aria-invalid={Boolean(errors.password)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <HiOutlineEyeOff className="w-4 h-4" />
                        ) : (
                            <HiOutlineEye className="w-4 h-4" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-error">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="cursor-pointer text-brand-400 text-sm hover:text-brand-300 transition-colors"
                    onClick={() => onForgot("forgotPassword")}
                >
                    Forgot password?
                </button>
            </div>

            <button
                type="submit"
                disabled={mutation.isPending}
                className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {mutation.isPending ? "Logging in..." : "Log in"}
            </button>
        </form>
    );
}
