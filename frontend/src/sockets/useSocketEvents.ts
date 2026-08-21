import { useChatSocket } from "../features/chats/hooks/useChatSocket";

export function useSocketEvents() {
    useChatSocket();
    //Add Other socket features
}
