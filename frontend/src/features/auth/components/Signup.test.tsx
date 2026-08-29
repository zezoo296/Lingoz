import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { toast } from "react-hot-toast";
import Signup from "./Signup.tsx";
import {
    renderWithProviders,
    screen,
    waitFor,
} from "../../../test/test-utils.tsx";
import { server } from "../../../test/mocks/server.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

describe("Signup Component", () => {
    it("displays validation errors for short name, invalid email, and short password", async () => {
        const { user } = renderWithProviders(<Signup onSuccess={vi.fn()} />);

        const submitButton = screen.getByRole("button", { name: /^sign up$/i });
        await user.click(submitButton);

        expect(
            await screen.findByText(/name must be at least 3 characters/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/please provide a valid email/i),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/password must be at least 8 characters/i),
        ).toBeInTheDocument();
    });

    it("toggles password visibility between masked and plain text", async () => {
        const { user } = renderWithProviders(<Signup onSuccess={vi.fn()} />);

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
            http.post(`${API_URL}/auth/signup`, async () => {
                await delay(200);
                return HttpResponse.json({ message: "Success" });
            }),
        );

        const { user } = renderWithProviders(<Signup onSuccess={vi.fn()} />);

        const nameInput = screen.getByPlaceholderText(/your name/i);
        const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
        const passwordInput = screen.getByPlaceholderText(/enter your password/i);
        const submitButton = screen.getByRole("button", { name: /^sign up$/i });

        await user.type(nameInput, "John Doe");
        await user.type(emailInput, "john@example.com");
        await user.type(passwordInput, "password123");
        await user.click(submitButton);

        expect(
            screen.getByRole("button", { name: /signing up\.\.\./i }),
        ).toBeDisabled();
        expect(nameInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
    });

    it("shows error toast when signup API returns an error", async () => {
        const toastErrorSpy = vi.spyOn(toast, "error");
        server.use(
            http.post(`${API_URL}/auth/signup`, () => {
                return HttpResponse.json(
                    { message: "Email already registered" },
                    { status: 409 },
                );
            }),
        );

        const { user } = renderWithProviders(<Signup onSuccess={vi.fn()} />);

        await user.type(screen.getByPlaceholderText(/your name/i), "John Doe");
        await user.type(
            screen.getByPlaceholderText(/you@example\.com/i),
            "existing@example.com",
        );
        await user.type(
            screen.getByPlaceholderText(/enter your password/i),
            "password123",
        );
        await user.click(screen.getByRole("button", { name: /^sign up$/i }));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith("Email already registered");
        });
    });

    it("shows success toast and calls onSuccess with 'login' on successful signup", async () => {
        const toastSuccessSpy = vi.spyOn(toast, "success");
        const onSuccessMock = vi.fn();
        server.use(
            http.post(`${API_URL}/auth/signup`, () => {
                return HttpResponse.json({ message: "Success" });
            }),
        );

        const { user } = renderWithProviders(<Signup onSuccess={onSuccessMock} />);

        await user.type(screen.getByPlaceholderText(/your name/i), "Jane Doe");
        await user.type(
            screen.getByPlaceholderText(/you@example\.com/i),
            "jane@example.com",
        );
        await user.type(
            screen.getByPlaceholderText(/enter your password/i),
            "password123",
        );
        await user.click(screen.getByRole("button", { name: /^sign up$/i }));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith("Signup successful!");
            expect(onSuccessMock).toHaveBeenCalledWith("login");
        });
    });
});
