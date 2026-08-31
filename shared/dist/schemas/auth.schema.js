"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordFormSchema = exports.resetPasswordSchema = exports.verifyResetOtpSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(3, "Name must be at least 3 characters"),
    email: zod_1.z.email("Please provide a valid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Please provide a valid email"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.email("Please provide a valid email"),
});
exports.verifyResetOtpSchema = zod_1.z.object({
    email: zod_1.z.email("Please provide a valid email"),
    otp: zod_1.z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});
exports.resetPasswordSchema = zod_1.z.object({
    resetToken: zod_1.z.string().min(1, "Reset token is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
exports.resetPasswordFormSchema = exports.resetPasswordSchema
    .extend({
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
