import { Router } from "express";
import { protect } from "../middleware/protect";
import { translateMessage } from "../controllers/message.controller";

const router = Router();

router.post("/:id/translate", protect, translateMessage)

export default router