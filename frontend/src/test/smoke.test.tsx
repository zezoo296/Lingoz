import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "./test-utils.tsx";
import { server } from "./mocks/server.ts";
import { mockSocket } from "./mocks/socket.ts";
import api from "../lib/api.ts";
import { socket } from "../sockets/socket.ts";

function SmokeComponent() {
    const location = useLocation();
    const { data = "loading" } = useQuery({
        queryKey: ["smoke-test-key"],
        queryFn: () => "ready",
    });

    return (
        <div>
            <h1>Smoke Test Header</h1>
            <p>Current Path: {location.pathname}</p>
            <p>Status: {data}</p>
        </div>
    );
}

describe("Frontend Infrastructure Smoke Tests", () => {
    it("renders a component wrapped in QueryClient and Router providers", async () => {
        renderWithProviders(<SmokeComponent />, {
            initialEntries: ["/smoke-route"],
        });

        expect(
            screen.getByRole("heading", { level: 1 }),
        ).toHaveTextContent("Smoke Test Header");
        expect(screen.getByText("Current Path: /smoke-route")).toBeInTheDocument();
        expect(await screen.findByText("Status: ready")).toBeInTheDocument();
    });

    it("MSW intercepts an HTTP request and Axios exposes the API message as an Error", async () => {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        server.use(
            http.get(`${baseUrl}/smoke-error`, () => {
                return HttpResponse.json(
                    { message: "Custom error from mock server" },
                    { status: 400 },
                );
            }),
        );

        await expect(api.get("/smoke-error")).rejects.toThrow(
            "Custom error from mock server",
        );
    });

    it("mocked socket module can be imported and used for events", () => {
        const messageHandler = vi.fn();
        socket.on("smoke:event", messageHandler);

        mockSocket.__trigger("smoke:event", { foo: "bar" });
        expect(messageHandler).toHaveBeenCalledWith({ foo: "bar" });

        socket.emit("smoke:send", { hello: "world" });
        expect(mockSocket.emit).toHaveBeenCalledWith("smoke:send", {
            hello: "world",
        });
    });
});
