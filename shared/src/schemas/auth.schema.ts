import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),

    email: z.email("Please provide a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z.email("Please provide a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Please provide a valid email"),
});

export const verifyResetOtpSchema = z.object({
    email: z.email("Please provide a valid email"),
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
    resetToken: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordFormSchema = resetPasswordSchema
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetOtpInput = z.infer<typeof verifyResetOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
