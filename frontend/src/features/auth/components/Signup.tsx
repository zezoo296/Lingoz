import {
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineLockClosed,
    HiOutlineMail,
    HiOutlineUser,
} from "react-icons/hi";
import { useState, type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { signup } from "../api/authApi";
import { signupSchema, type SignupInput } from "@linguachat/shared";

type SignupProps = {
    onSuccess: (action: "login") => void;
}

export default function Signup({onSuccess} : SignupProps): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Signup successful!");
            onSuccess("login");
        },
        onError: (e) => {
            toast.error(e.message);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        mode: "onTouched"
    });

    const onSubmit = (data: SignupInput) => {
        mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="fadeLeft space-y-5">
            {/* Name */}
            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Name
                </label>

                <div className="relative">
                    <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

                    <input
                        type="text"
                        placeholder="Your name"
                        {...register("name")}
                        disabled={isPending}
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                        aria-invalid={Boolean(errors.name)}
                    />
                </div>

                {errors.name && (
                    <p className="mt-2 text-sm text-error">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-text-primary text-sm font-medium mb-2">
                    Email
                </label>

                <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

                    <input
                        type="text"
                        placeholder="you@example.com"
                        {...register("email")}
                        disabled={isPending}
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

            {/* Password */}
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
                        disabled={isPending}
                        className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-11 text-text-primary text-sm placeholder:text-text-disabled focus:outline-none focus:border-border-active focus:ring-1 focus:ring-border-active transition-all disabled:opacity-60"
                        aria-invalid={Boolean(errors.password)}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
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

            <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isPending ? "Signing up..." : "Sign up"}
            </button>
        </form>
    );
}
