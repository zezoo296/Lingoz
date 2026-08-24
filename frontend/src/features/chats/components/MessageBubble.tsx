// Updated MessageBubble.tsx
import { memo } from "react";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";
import {
    formatMessageTime,
    getMessageDeliveryStatus,
    getMessageSenderName,
    getMessageSenderPhoto,
    isGroupMessage,
    isMessageSentByCurrentUser,
    type Message,
} from "../lib/helpers";
import { MessageTranslation } from "./MessageTranslation";

interface MessageBubbleProps {
    message: Message;
    currentUserId?: number;
    directChatName?: string;
}

const MessageStatusIcon = memo(function MessageStatusIcon({
    message,
    currentUserId,
}: {
    message: Message;
    currentUserId?: number;
}) {
    if (!isMessageSentByCurrentUser(message, currentUserId)) return null;

    const status = getMessageDeliveryStatus(message);
    const baseClass = "w-3 h-3";

    switch (status) {
        case "Read":
            return (
                <RiCheckDoubleLine className={`${baseClass} text-blue-300`} />
            );
        case "Delivered":
            return (
                <RiCheckDoubleLine className={`${baseClass} text-white/60`} />
            );
        default:
            return <RiCheckLine className={`${baseClass} text-white/60`} />;
    }
});

export const MessageBubble = memo(function MessageBubble({
    message,
    currentUserId,
    directChatName,
}: MessageBubbleProps) {
    const isMe = isMessageSentByCurrentUser(message, currentUserId);
    const senderName = getMessageSenderName(
        message,
        currentUserId,
        directChatName,
    );
    const senderPhoto = getMessageSenderPhoto(message);

    return (
        <div
            className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"} mb-3`}
        >
            {/* Avatar: only for group messages from others */}
            {!isMe && isGroupMessage(message) && (
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 self-end mb-1 overflow-hidden">
                    {senderPhoto ? (
                        <img
                            src={senderPhoto}
                            alt={senderName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-brand-500 text-xs font-semibold">
                            {senderName.charAt(0) || "?"}
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-col max-w-[75%]">
                {/* Sender name: only for group messages from others */}
                {!isMe && isGroupMessage(message) && (
                    <span className="text-xs text-text-muted mb-1 ml-1">
                        {senderName}
                    </span>
                )}

                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                            ? "bg-brand-500 text-white rounded-br-md"
                            : "bg-surface-elevated text-text-primary rounded-bl-md border border-border"
                    }`}
                >
                    {/* Translation-enabled content */}
                    <MessageTranslation
                        messageId={message.id}
                        originalContent={message.content}
                    />

                    <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                            isMe ? "text-white/60" : "text-text-muted"
                        }`}
                    >
                        <span className="text-[10px]">
                            {formatMessageTime(message.createdAt)}
                        </span>
                        <MessageStatusIcon
                            message={message}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
