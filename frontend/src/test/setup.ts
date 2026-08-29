import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import React from "react";
import { server } from "./mocks/server.ts";
import { mockSocket } from "./mocks/socket.ts";

// Mock the socket module
vi.mock("../sockets/socket.ts", () => ({
    socket: mockSocket,
}));

// Stub Google OAuth provider & components
vi.mock("@react-oauth/google", () => ({
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => children,
    GoogleLogin: () => React.createElement("div", { "data-testid": "mock-google-login" }, "Mock Google Login"),
    useGoogleLogin: () => vi.fn(),
}));

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
    mockSocket.__reset();
    vi.clearAllMocks();
});

afterAll(() => {
    server.close();
});
