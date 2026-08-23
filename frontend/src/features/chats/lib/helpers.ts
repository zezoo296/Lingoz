import type { ChatItem, DirectMessage, GroupMessage } from "@linguachat/shared";

export type Message = DirectMessage | GroupMessage;
export type DeliveryStatus =
    ChatItem["lastMessage"]["statuses"][number]["status"];

export function isGroupMessage(message: Message): message is GroupMessage {
    return "sender" in message;
}

export function isMessageSentByCurrentUser(
    message: Message,
    currentUserId?: number,
): boolean {
    if (!currentUserId) return false;

    return isGroupMessage(message)
        ? message.sender.id === currentUserId
        : message.senderId === currentUserId;
}

function getDeliveryStatus(
    statuses: { status: DeliveryStatus }[],
): DeliveryStatus {
    if (statuses.length === 0) return "UnDelivered";
    if (statuses.every(({ status }) => status === "Read")) return "Read";
    if (
        statuses.every(
            ({ status }) => status === "Delivered" || status === "Read",
        )
    ) {
        return "Delivered";
    }
    return "UnDelivered";
}

export function getMessageDeliveryStatus(message: Message): DeliveryStatus {
    return isGroupMessage(message)
        ? getDeliveryStatus(message.statuses)
        : message.status;
}

export function getLastMessageDeliveryStatus(chat: ChatItem): DeliveryStatus {
    return getDeliveryStatus(chat.lastMessage.statuses);
}

export function getMessageSenderName(
    message: Message,
    currentUserId?: number,
    directChatName?: string,
): string {
    if (isGroupMessage(message)) return message.sender.name || "Unknown";

    return isMessageSentByCurrentUser(message, currentUserId)
        ? "You"
        : directChatName || "Unknown";
}

export function getMessageSenderPhoto(message: Message): string | null {
    return isGroupMessage(message) ? message.sender.photo : null;
}

export function isSameDay(
    first: Date | string,
    second: Date | string,
): boolean {
    const firstDate = new Date(first);
    const secondDate = new Date(second);

    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
}

export function formatDateDivider(date: Date | string): string {
    const dateObj = new Date(date);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(dateObj, today)) return "Today";
    if (isSameDay(dateObj, yesterday)) return "Yesterday";

    return dateObj.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatMessageTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function generateOptimisticMessageId() {
    return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createOptimisticMessage(
    chatType: "Direct" | "Group",
    chatId: string,
    content: string,
    currentUser: {
        id: number;
        name: string | null;
        photo: string | null;
    },
): DirectMessage | GroupMessage {
    const base = {
        id: generateOptimisticMessageId(),
        chatId,
        content,
        createdAt: new Date(),
    };

    if (chatType === "Group") {
        return {
            ...base,
            client_id: null,
            sender: currentUser,
            statuses: [],
        };
    }

    return {
        ...base,
        client_id: null,
        senderId: currentUser.id,
        recieverId: null,
        status: "UnDelivered",
    };
}


export type Tabs = "All" | "Unread" | "Favourites" | "Group"