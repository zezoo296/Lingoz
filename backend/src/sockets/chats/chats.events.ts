import { Server, Socket } from "socket.io";
import {
    chatsJoiningHandler,
    closeChatHandler,
    newMessageHandler,
    openChatHandler,
} from "./chats.handlers";
import { CHAT_EVENTS } from "@linguachat/shared";

export const registerChatEvents = async (socket: Socket, io: Server) => {
    await chatsJoiningHandler(socket, io);

    socket.on(CHAT_EVENTS.NEW_MESSAGE, (data) => {
        newMessageHandler(io, socket, data);
    });

    socket.on(CHAT_EVENTS.OPEN_CHAT, (data) => {
        openChatHandler(socket, io, data);
    });

    socket.on(CHAT_EVENTS.CLOSE_CHAT, (data) => {
        closeChatHandler(socket, data);
    });
};

