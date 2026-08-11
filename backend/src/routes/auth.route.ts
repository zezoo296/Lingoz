import { Router } from "express";
import { getCurrentUser, login, logout, signup } from "../controllers/auth.controller";
import { protect } from "../middleware/protect";
import validate from "../middleware/validate";
import { signupSchema, loginSchema } from "@linguachat/shared";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;
