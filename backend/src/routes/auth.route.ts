import { Router } from "express";
import { signup } from "../controllers/auth.controller";
import validate from "../middleware/validate";
import { signupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login");
router.post("/logout");

export default router;
