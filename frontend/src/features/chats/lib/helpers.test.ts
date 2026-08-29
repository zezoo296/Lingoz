import { describe, it, expect } from "vitest";
import {
    isGroupMessage,
    isMessageSentByCurrentUser,
    getMessageDeliveryStatus,
    getLastMessageDeliveryStatus,
    getMessageSenderName,
    getMessageSenderPhoto,
    isSameDay,
    formatDateDivider,
    formatMessageTime,
    createOptimisticMessage,
} from "./helpers.ts";
import type { ChatItem, DirectMessage, GroupMessage } from "@linguachat/shared";

describe("Chat Helpers", () => {
    const mockUser = { id: 1, name: "Me", photo: "me.jpg" };
    const mockOtherUser = { id: 2, name: "Alice", photo: "alice.jpg" };

    const directMsg: DirectMessage = {
        id: "msg-1",
        client_id: null,
        chatId: "chat-1",
        content: "hello",
        createdAt: new Date(),
        senderId: 1,
        recieverId: 2,
        status: "Read",
        suggestions: null,
    };

    const groupMsg: GroupMessage = {
        id: "msg-2",
        client_id: null,
        chatId: "chat-2",
        content: "hello team",
        createdAt: new Date(),
        sender: mockOtherUser,
        statuses: [
            { userId: 1, status: "Read", updatedAt: new Date() },
            { userId: 3, status: "Delivered", updatedAt: new Date() },
        ],
        suggestions: null,
    };

    describe("isGroupMessage", () => {
        it("identifies group message containing sender property", () => {
            expect(isGroupMessage(groupMsg)).toBe(true);
            expect(isGroupMessage(directMsg)).toBe(false);
        });
    });

    describe("isMessageSentByCurrentUser", () => {
        it("returns true if senderId matches currentUserId for direct messages", () => {
            expect(isMessageSentByCurrentUser(directMsg, 1)).toBe(true);
            expect(isMessageSentByCurrentUser(directMsg, 2)).toBe(false);
        });

        it("returns true if sender.id matches currentUserId for group messages", () => {
            const myGroupMsg = { ...groupMsg, sender: mockUser };
            expect(isMessageSentByCurrentUser(myGroupMsg, 1)).toBe(true);
            expect(isMessageSentByCurrentUser(groupMsg, 1)).toBe(false);
        });

        it("returns false if currentUserId is not provided", () => {
            expect(isMessageSentByCurrentUser(directMsg)).toBe(false);
        });
    });

    describe("getMessageDeliveryStatus", () => {
        it("returns direct message status directly", () => {
            expect(getMessageDeliveryStatus(directMsg)).toBe("Read");
        });

        it("derives group message status from statuses array", () => {
            const allReadMsg: GroupMessage = {
                ...groupMsg,
                statuses: [
                    { userId: 1, status: "Read", updatedAt: new Date() },
                    { userId: 3, status: "Read", updatedAt: new Date() },
                ],
            };
            expect(getMessageDeliveryStatus(allReadMsg)).toBe("Read");

            const deliveredMsg: GroupMessage = {
                ...groupMsg,
                statuses: [
                    { userId: 1, status: "Read", updatedAt: new Date() },
                    { userId: 3, status: "Delivered", updatedAt: new Date() },
                ],
            };
            expect(getMessageDeliveryStatus(deliveredMsg)).toBe("Delivered");

            const unDeliveredMsg: GroupMessage = {
                ...groupMsg,
                statuses: [
                    { userId: 1, status: "Read", updatedAt: new Date() },
                    { userId: 3, status: "UnDelivered", updatedAt: new Date() },
                ],
            };
            expect(getMessageDeliveryStatus(unDeliveredMsg)).toBe("UnDelivered");
        });
    });

    describe("getLastMessageDeliveryStatus", () => {
        it("derives status from lastMessage statuses array", () => {
            const chat: ChatItem = {
                id: "chat-1",
                type: "Direct",
                isFavourite: false,
                name: "Alice",
                photo: "alice.jpg",
                lastMessage: {
                    id: "msg-1",
                    content: "hello",
                    created_at: new Date().toISOString(),
                    sender: { id: 1, name: "Me" },
                    statuses: [
                        { userId: 2, status: "Read" },
                    ],
                    suggestions: null,
                },
                unreadCount: 0,
            };
            expect(getLastMessageDeliveryStatus(chat)).toBe("Read");
        });
    });

    describe("getMessageSenderName", () => {
        it("returns 'You' for direct message sent by current user", () => {
            expect(getMessageSenderName(directMsg, 1, "Alice")).toBe("You");
        });

        it("returns directChatName for direct message sent by other user", () => {
            const directMsgFromOther = { ...directMsg, senderId: 2 };
            expect(getMessageSenderName(directMsgFromOther, 1, "Alice")).toBe("Alice");
        });

        it("returns sender name for group message", () => {
            expect(getMessageSenderName(groupMsg, 1)).toBe("Alice");
        });
    });

    describe("getMessageSenderPhoto", () => {
        it("returns sender photo for group message and null for direct message", () => {
            expect(getMessageSenderPhoto(groupMsg)).toBe("alice.jpg");
            expect(getMessageSenderPhoto(directMsg)).toBeNull();
        });
    });

    describe("isSameDay and formatDateDivider", () => {
        it("compares dates correctly", () => {
            const today = new Date();
            const sameDay = new Date(today);
            const otherDay = new Date(today);
            otherDay.setDate(today.getDate() - 5);

            expect(isSameDay(today, sameDay)).toBe(true);
            expect(isSameDay(today, otherDay)).toBe(false);
        });

        it("formats dividers as Today, Yesterday, or full date", () => {
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const pastDate = new Date("2026-05-15T12:00:00.000Z");

            expect(formatDateDivider(today)).toBe("Today");
            expect(formatDateDivider(yesterday)).toBe("Yesterday");
            expect(formatDateDivider(pastDate)).toContain("2026");
        });
    });

    describe("formatMessageTime", () => {
        it("formats times for today, yesterday, and weekday correctly", () => {
            const now = new Date();
            const todayTime = formatMessageTime(now);
            expect(todayTime).toContain("Today");

            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            const yesterdayTime = formatMessageTime(yesterday);
            expect(yesterdayTime).toContain("Yesterday");
        });
    });

    describe("createOptimisticMessage", () => {
        it("returns a DirectMessage shape for Direct chatType", () => {
            const optimistic = createOptimisticMessage("Direct", "chat-1", "hello", mockUser);
            expect(optimistic.id).toContain("optimistic-");
            expect(optimistic.chatId).toBe("chat-1");
            expect(optimistic.content).toBe("hello");
            expect(isGroupMessage(optimistic)).toBe(false);
            if (!isGroupMessage(optimistic)) {
                expect(optimistic.senderId).toBe(mockUser.id);
                expect(optimistic.status).toBe("UnDelivered");
            }
        });

        it("returns a GroupMessage shape for Group chatType", () => {
            const optimistic = createOptimisticMessage("Group", "chat-2", "hello group", mockUser);
            expect(optimistic.id).toContain("optimistic-");
            expect(optimistic.chatId).toBe("chat-2");
            expect(optimistic.content).toBe("hello group");
            expect(isGroupMessage(optimistic)).toBe(true);
            if (isGroupMessage(optimistic)) {
                expect(optimistic.sender).toEqual(mockUser);
                expect(optimistic.statuses).toEqual([]);
            }
        });
    });
});
