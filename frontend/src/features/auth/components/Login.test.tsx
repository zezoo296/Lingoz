import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { toast } from "react-hot-toast";
import Login from "./Login.tsx";
import {
    renderWithProviders,
    renderWithRoutes,
    screen,
    waitFor,
} from "../../../test/test-utils.tsx";
import { server } from "../../../test/mocks/server.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

describe("Login Component", () => {
    it("displays validation errors for empty and invalid inputs", async () => {
        const { user } = renderWithProviders(<Login onForgot={vi.fn()} />);

        const submitButton = screen.getByRole("button", { name: /^log in$/i });
        await user.click(submitButton);

        expect(
            await screen.findByText(/please provide a valid email/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/password must be at least 8 characters/i),
        ).toBeInTheDocument();
    });

    it("toggles password visibility between masked and plain text", async () => {
        const { user } = renderWithProviders(<Login onForgot={vi.fn()} />);

        const passwordInput = screen.getByPlaceholderText(/enter your password/i);
        const toggleButton = screen.getByRole("button", { name: /show password/i });

        expect(passwordInput).toHaveAttribute("type", "password");

        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");
        expect(
            screen.getByRole("button", { name: /hide password/i }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /hide password/i }));
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("disables inputs and displays pending indicator during submission", async () => {
        server.use(
            http.post(`${API_URL}/auth/login`, async () => {
                await delay(200);
                return HttpResponse.json({ message: "Success" });
            }),
        );

        const { user } = renderWithProviders(<Login onForgot={vi.fn()} />);

        const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
        const passwordInput = screen.getByPlaceholderText(/enter your password/i);
        const submitButton = screen.getByRole("button", { name: /^log in$/i });

        await user.type(emailInput, "user@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        expect(
            screen.getByRole("button", { name: /logging in\.\.\./i }),
        ).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
    });

    it("shows error toast when login API returns an error", async () => {
        const toastErrorSpy = vi.spyOn(toast, "error");
        server.use(
            http.post(`${API_URL}/auth/login`, () => {
                return HttpResponse.json(
                    { message: "Invalid email or password" },
                    { status: 401 },
                );
            }),
        );

        const { user } = renderWithProviders(<Login onForgot={vi.fn()} />);

        await user.type(
            screen.getByPlaceholderText(/you@example\.com/i),
            "wrong@example.com",
        );
        await user.type(
            screen.getByPlaceholderText(/enter your password/i),
            "wrongpassword",
        );
        await user.click(screen.getByRole("button", { name: /^log in$/i }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("Invalid email or password");
        });
    });

    it("shows success toast and navigates to /profile upon successful login", async () => {
        const toastSuccessSpy = vi.spyOn(toast, "success");
        server.use(
            http.post(`${API_URL}/auth/login`, () => {
                return HttpResponse.json({ message: "Success" });
            }),
        );

        const { user, router } = renderWithRoutes([
            { path: "/", element: <Login onForgot={vi.fn()} /> },
            { path: "/profile", element: <div>Profile Destination</div> },
        ]);

        await user.type(
            screen.getByPlaceholderText(/you@example\.com/i),
            "user@example.com",
        );
        await user.type(
            screen.getByPlaceholderText(/enter your password/i),
            "password123",
        );
        await user.click(screen.getByRole("button", { name: /^log in$/i }));

        await screen.findByText("Profile Destination");
        expect(router.state.location.pathname).toBe("/profile");
        expect(toastSuccessSpy).toHaveBeenCalledWith("Logged in successfully!");
    });

    it("invokes onForgot callback when 'Forgot password?' is clicked", async () => {
        const onForgotMock = vi.fn();
        const { user } = renderWithProviders(<Login onForgot={onForgotMock} />);

        const forgotButton = screen.getByRole("button", {
            name: /forgot password\?/i,
        });
        await user.click(forgotButton);

        expect(onForgotMock).toHaveBeenCalledWith("forgotPassword");
    });
});
