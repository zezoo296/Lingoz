import { Router } from "express";
import { getChatMessages, getUserChats } from "../controllers/chats.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/", protect, getUserChats);
router.get("/:id", protect, getChatMessages)


export default router;
