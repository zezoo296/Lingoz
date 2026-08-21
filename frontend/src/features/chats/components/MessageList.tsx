import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";
import {
    formatDateDivider,
    formatMessageTime,
    getMessageDeliveryStatus,
    getMessageSenderName,
    getMessageSenderPhoto,
    isGroupMessage,
    isMessageSentByCurrentUser,
    isSameDay,
    type Message,
} from "../lib/helpers";

interface MessageListProps {
    messages: Message[];
    currentUserId?: number;
    directChatName?: string;
}

function MessageStatus({
    message,
    currentUserId,
}: {
    message: Message;
    currentUserId?: number;
}) {
    if (!isMessageSentByCurrentUser(message, currentUserId)) return null;

    const status = getMessageDeliveryStatus(message);
    if (status === "Read") {
        return <RiCheckDoubleLine className="w-3 h-3 text-blue-300" />;
    }
    if (status === "Delivered") {
        return <RiCheckDoubleLine className="w-3 h-3 text-white/60" />;
    }
    return <RiCheckLine className="w-3 h-3 text-white/60" />;
}

export default function MessageList({
    messages,
    currentUserId,
    directChatName,
}: MessageListProps) {
    let lastDate: Date | null = null;
    const displayMessages = [...messages].reverse();

    return displayMessages.flatMap((message) => {
        const messageDate = message.createdAt;
        const dateDivider =
            !lastDate || !isSameDay(messageDate, lastDate) ? (
                <div
                    key={`date-${message.id}`}
                    className="flex items-center justify-center my-4"
                >
                    <div className="px-3 py-1 rounded-full bg-surface-elevated border border-border">
                        <span className="text-xs text-text-muted font-medium">
                            {formatDateDivider(messageDate)}
                        </span>
                    </div>
                </div>
            ) : null;
        lastDate = messageDate;

        const messageIsMe = isMessageSentByCurrentUser(message, currentUserId);
        const senderName = getMessageSenderName(
            message,
            currentUserId,
            directChatName,
        );
        const senderPhoto = getMessageSenderPhoto(message);

        const messageElement = (
            <div
                key={message.id}
                className={`flex gap-2 ${messageIsMe ? "justify-end" : "justify-start"}`}
            >
                {!messageIsMe && isGroupMessage(message) && (
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0 self-end mb-1">
                        {senderPhoto ? (
                            <img
                                src={senderPhoto}
                                alt={senderName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-brand-500 text-xs font-semibold">
                                {senderName.charAt(0)}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex flex-col max-w-[75%]">
                    {!messageIsMe && isGroupMessage(message) && (
                        <span className="text-xs text-text-muted mb-1 ml-1">
                            {senderName}
                        </span>
                    )}

                    <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            messageIsMe
                                ? "bg-brand-500 text-white rounded-br-md"
                                : "bg-surface-elevated text-text-primary rounded-bl-md border border-border"
                        }`}
                    >
                        <p>{message.content}</p>
                        <div
                            className={`flex items-center justify-end gap-1 mt-1 ${messageIsMe ? "text-white/60" : "text-text-muted"}`}
                        >
                            <span className="text-[10px]">
                                {formatMessageTime(message.createdAt)}
                            </span>
                            <MessageStatus
                                message={message}
                                currentUserId={currentUserId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );

        return dateDivider ? [dateDivider, messageElement] : [messageElement];
    });
}
