export {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyResetOtpSchema,
    resetPasswordSchema,
    resetPasswordFormSchema,
} from "./schemas/auth.schema";

export { userSchema } from "./schemas/user.schema";

export {
    sendFriendRequestSchema,
    updateFriendRequestSchema,
} from "./schemas/friendship.schema";

export type {
    SignupInput,
    LoginInput,
    ForgotPasswordInput,
    VerifyResetOtpInput,
    ResetPasswordInput,
    ResetPasswordFormInput,
} from "./schemas/auth.schema";

export type { AuthenticatedUser } from "./schemas/user.schema";

export type {
    SendFriendRequestInput,
    UpdateFriendRequestInput,
} from "./schemas/friendship.schema";
