"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFriendRequestSchema = exports.sendFriendRequestSchema = void 0;
const zod_1 = require("zod");
exports.sendFriendRequestSchema = zod_1.z.object({
    receiverId: zod_1.z.coerce.number().int().positive("Receiver ID must be a positive integer"),
});
exports.updateFriendRequestSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "REJECTED"]),
});
