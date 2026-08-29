import { describe, it, expect } from "vitest";
import { http, HttpResponse, delay } from "msw";
import GuestRoute from "./GuestRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import {
    renderWithRoutes,
    screen,
} from "../../../test/test-utils.tsx";
import { server } from "../../../test/mocks/server.ts";
import { mockAuthenticatedUser } from "../../../test/fixtures/index.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

describe("Route Guards", () => {
    describe("GuestRoute", () => {
        it("displays loading state while resolving authentication", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, async () => {
                    await delay(200);
                    return HttpResponse.json({ data: mockAuthenticatedUser });
                }),
            );

            renderWithRoutes([
                {
                    element: <GuestRoute />,
                    children: [{ path: "/", element: <div>Guest Content</div> }],
                },
            ]);

            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });

        it("renders child outlet when user is unauthenticated", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, () => {
                    return HttpResponse.json(
                        { message: "Unauthorized" },
                        { status: 401 },
                    );
                }),
            );

            renderWithRoutes([
                {
                    element: <GuestRoute />,
                    children: [{ path: "/", element: <div>Guest Public View</div> }],
                },
            ]);

            expect(
                await screen.findByText("Guest Public View"),
            ).toBeInTheDocument();
        });

        it("redirects authenticated user to /profile", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, () => {
                    return HttpResponse.json({ data: mockAuthenticatedUser });
                }),
            );

            const { router } = renderWithRoutes([
                {
                    element: <GuestRoute />,
                    children: [{ path: "/", element: <div>Guest Public View</div> }],
                },
                {
                    path: "/profile",
                    element: <div>profile page</div>,
                },
            ]);

            expect(await screen.findByText("profile page")).toBeInTheDocument();
            expect(router.state.location.pathname).toBe("/profile");
        });
    });

    describe("ProtectedRoute", () => {
        it("displays loading state while resolving authentication", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, async () => {
                    await delay(200);
                    return HttpResponse.json({ data: mockAuthenticatedUser });
                }),
            );

            renderWithRoutes([
                {
                    element: <ProtectedRoute />,
                    children: [
                        { path: "/protected", element: <div>Secret Dashboard</div> },
                    ],
                },
            ], { initialEntries: ["/protected"] });

            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });

        it("redirects unauthenticated user to /", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, () => {
                    return HttpResponse.json(
                        { message: "Unauthorized" },
                        { status: 401 },
                    );
                }),
            );

            const { router } = renderWithRoutes([
                {
                    element: <ProtectedRoute />,
                    children: [
                        { path: "/protected", element: <div>Secret Dashboard</div> },
                    ],
                },
                {
                    path: "/",
                    element: <div>Login Landing Page</div>,
                },
            ], { initialEntries: ["/protected"] });

            expect(
                await screen.findByText("Login Landing Page"),
            ).toBeInTheDocument();
            expect(router.state.location.pathname).toBe("/");
        });

        it("renders child outlet when user is authenticated", async () => {
            server.use(
                http.get(`${API_URL}/auth/me`, () => {
                    return HttpResponse.json({ data: mockAuthenticatedUser });
                }),
            );

            const { router } = renderWithRoutes([
                {
                    element: <ProtectedRoute />,
                    children: [
                        { path: "/protected", element: <div>Secret Dashboard</div> },
                    ],
                },
            ], { initialEntries: ["/protected"] });

            expect(
                await screen.findByText("Secret Dashboard"),
            ).toBeInTheDocument();
            expect(router.state.location.pathname).toBe("/protected");
        });
    });
});
