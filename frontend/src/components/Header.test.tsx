import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { Outlet } from "react-router";
import Header from "./Header.tsx";
import {
    renderWithRoutes,
    screen,
} from "../test/test-utils.tsx";
import { server } from "../test/mocks/server.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

describe("Header and Logout", () => {
    it("logs out successfully, clears QueryClient cache, and navigates to /", async () => {
        let logoutCalled = false;
        server.use(
            http.post(`${API_URL}/auth/logout`, () => {
                logoutCalled = true;
                return HttpResponse.json({ message: "Logged out" });
            }),
        );

        const { user, router, queryClient } = renderWithRoutes(
            [
                { path: "/profile", element: <Header /> },
                { path: "/", element: <div>Home Landing</div> },
            ],
            { initialEntries: ["/profile"] },
        );

        queryClient.setQueryData(["test-key"], { foo: "bar" });
        const clearSpy = vi.spyOn(queryClient, "clear");

        const logoutButton = screen.getByTitle("Logout");
        await user.click(logoutButton);

        await screen.findByText("Home Landing");
        expect(logoutCalled).toBe(true);
        expect(clearSpy).toHaveBeenCalled();
        expect(router.state.location.pathname).toBe("/");
    });

    it("navigates to respective destinations when navigation buttons are clicked", async () => {
        const { user, router } = renderWithRoutes(
            [
                {
                    element: (
                        <>
                            <Header />
                            <Outlet />
                        </>
                    ),
                    children: [
                        { path: "/chats", element: <div>Chats Page</div> },
                        { path: "/network", element: <div>Network Page</div> },
                        { path: "/friends", element: <div>Friends Page</div> },
                        { path: "/profile", element: <div>Profile Page</div> },
                    ],
                },
            ],
            { initialEntries: ["/chats"] },
        );

        const networkBtn = screen.getByRole("button", { name: /network/i });
        await user.click(networkBtn);
        expect(router.state.location.pathname).toBe("/network");

        const friendsBtn = screen.getByRole("button", { name: /friends/i });
        await user.click(friendsBtn);
        expect(router.state.location.pathname).toBe("/friends");

        const profileBtn = screen.getByRole("button", { name: /profile/i });
        await user.click(profileBtn);
        expect(router.state.location.pathname).toBe("/profile");
    });
});
