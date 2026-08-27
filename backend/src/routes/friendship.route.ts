import { Router } from "express";
import {
    cancelFriendRequest,
    getReceivedFriendRequests,
    getSentFriendRequests,
    getConnections,
    removeFriendship,
    respondToFriendRequest,
    sendFriendRequest,
} from "../controllers/friendship.controller";
import { protect } from "../middleware/protect";
import validate from "../middleware/validate";
import {
    sendFriendRequestSchema,
    updateFriendRequestSchema,
} from "@linguachat/shared";

const router = Router();

router.use(protect);
router.post("/requests", validate(sendFriendRequestSchema), sendFriendRequest);
router.get("/requests/received", getReceivedFriendRequests);
router.get("/requests/sent", getSentFriendRequests);
router.get("/connections", getConnections);
router.patch(
    "/requests/:requestId",
    validate(updateFriendRequestSchema),
    respondToFriendRequest,
);
router.delete("/requests/:requestId", cancelFriendRequest);
router.delete("/:friendId", removeFriendship);

export default router;
