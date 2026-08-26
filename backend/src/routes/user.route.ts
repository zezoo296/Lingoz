import { Router } from "express";
import { protect } from "../middleware/protect";
import { getUsers } from "../controllers/user.controller";
const router = Router();

router.get("/", protect, getUsers)

export default router;