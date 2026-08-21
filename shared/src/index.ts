export {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyResetOtpSchema,
    resetPasswordSchema,
    resetPasswordFormSchema,
} from "./schemas/auth.schema";

export { userSchema } from "./schemas/user.schema";

export {
    sendFriendRequestSchema,
    updateFriendRequestSchema,
} from "./schemas/friendship.schema";

export {
    chatItemSchema,
    chatMessagesResponseSchema,
    messageStatusSchema,
} from "./schemas/chat.schema";

export type {
    SignupInput,
    LoginInput,
    ForgotPasswordInput,
    VerifyResetOtpInput,
    ResetPasswordInput,
    ResetPasswordFormInput,
} from "./schemas/auth.schema";

export type { AuthenticatedUser } from "./schemas/user.schema";

export type {
    SendFriendRequestInput,
    UpdateFriendRequestInput,
} from "./schemas/friendship.schema";

export type {
    ChatItem,
    ChatMessagesResponse,
    DirectMessage,
    GroupMessage,
    directMessageSchema,
    groupMessageSchema,
} from "./schemas/chat.schema";

export {
    CHAT_EVENTS,
    newMessageInputSchema,
    openChatInputSchema,
    chatOpenedSchema,
    messagesDeliveredSchema,
} from "./events/chat.events";
export type {
    NewMessageInput,
    OpenChatInput,
    ChatOpenedEvent,
    MessagesDeliveredEvent,
} from "./events/chat.events";
