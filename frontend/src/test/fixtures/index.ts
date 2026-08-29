import type {
    AuthenticatedUser,
    UserProfile,
    ChatItem,
    DirectMessage,
    GroupMessage,
} from "@linguachat/shared";

export const mockAuthenticatedUser: AuthenticatedUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    birthday: "1995-05-15T00:00:00.000Z",
    photo: "https://example.com/photo.jpg",
    gender: "MALE",
    lastSeen: "2026-08-29T12:00:00.000Z",
    hasSeenOnboarding: true,
};

export const mockUserProfile: UserProfile = {
    id: 1,
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    birthday: "1995-05-15T00:00:00.000Z",
    photo: "https://example.com/photo.jpg",
    gender: "MALE",
    countryCode: "US",
    city: "New York",
    lastSeen: "2026-08-29T12:00:00.000Z",
    hasSeenOnboarding: true,
    userLanguages: [
        {
            languageCode: "en",
            isSpeaking: true,
            isLearning: false,
        },
        {
            languageCode: "es",
            isSpeaking: false,
            isLearning: true,
        },
    ],
};

export const mockChatItem: ChatItem = {
    id: "chat-1",
    type: "Direct",
    isFavourite: false,
    name: "Alice Smith",
    photo: "https://example.com/alice.jpg",
    lastMessage: {
        id: "msg-1",
        content: "Hello there!",
        created_at: "2026-08-29T12:00:00.000Z",
        sender: {
            id: 2,
            name: "Alice Smith",
        },
        statuses: [
            {
                userId: 1,
                status: "Delivered",
            },
        ],
        suggestions: null,
    },
    unreadCount: 0,
};

export const mockDirectMessage: DirectMessage = {
    id: "msg-1",
    client_id: null,
    chatId: "chat-1",
    content: "Hello there!",
    createdAt: new Date("2026-08-29T12:00:00.000Z"),
    senderId: 2,
    recieverId: 1,
    status: "Delivered",
    suggestions: null,
};

export const mockGroupMessage: GroupMessage = {
    id: "group-msg-1",
    client_id: null,
    chatId: "group-chat-1",
    content: "Hello everyone!",
    createdAt: new Date("2026-08-29T12:00:00.000Z"),
    sender: {
        id: 2,
        name: "Alice Smith",
        photo: null,
    },
    statuses: [
        {
            userId: 1,
            status: "Delivered",
            updatedAt: new Date("2026-08-29T12:00:00.000Z"),
        },
    ],
    suggestions: null,
};
