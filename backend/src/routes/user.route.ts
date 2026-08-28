import { Router } from "express";
import { protect } from "../middleware/protect";
import {
    getMe,
    getUsers,
    updateMe,
    updateUserLanguages,
} from "../controllers/user.controller";
import validate from "../middleware/validate";
import upload from "../config/multer";
import { updateUserLanguagesSchema, updateUserSchema } from "@linguachat/shared";
const router = Router();

router.get("/", protect, getUsers)
router.get("/me", protect, getMe)
router.patch(
    "/me",
    protect,
    upload.single("photo") as any,
    validate(updateUserSchema) as any,
    updateMe,
);
router.patch(
    "/me/languages",
    protect,
    validate(updateUserLanguagesSchema),
    updateUserLanguages,
);

export default router;
