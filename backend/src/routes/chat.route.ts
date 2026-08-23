import { Router } from "express";
import { getChatMessages, getUserChats, toggleChatFavourites } from "../controllers/chats.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/", protect, getUserChats);
router.get("/:id", protect, getChatMessages)
router.post("/:id/favourite", protect, toggleChatFavourites)

export default router;
