import { Router } from "express";
import {
    getCurrentUser,
    login,
    logout,
    signup,
    loginWithGoogle,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
} from "../controllers/auth.controller";
import { protect } from "../middleware/protect";
import validate from "../middleware/validate";
import {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyResetOtpSchema,
    resetPasswordSchema,
} from "@linguachat/shared";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
    "/verify-reset-otp",
    validate(verifyResetOtpSchema),
    verifyResetOtp,
);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.post("/google/token", loginWithGoogle);

export default router;
