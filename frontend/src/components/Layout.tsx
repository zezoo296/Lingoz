import { Outlet } from "react-router";
import Header from "./Header";
import { socket } from "../sockets/socket";
import { useEffect } from "react";
import { useSocketEvents } from "../sockets/useSocketEvents";

export default function Layout() {
    useSocketEvents();

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);
    
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
