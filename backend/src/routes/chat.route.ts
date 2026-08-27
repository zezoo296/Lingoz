import { Router } from "express";
import { getChatMessages, getMessageSuggestions, getOrCreateDirectChat, getUserChats, toggleChatFavourites } from "../controllers/chats.controller";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/", protect, getUserChats);
router.post("/direct/:recipientId", protect, getOrCreateDirectChat);
router.get("/:id", protect, getChatMessages)
router.post("/:id/favourite", protect, toggleChatFavourites)
router.post("/ai/message-suggestions", protect, getMessageSuggestions);

export default router;
