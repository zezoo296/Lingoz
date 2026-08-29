import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import AuthPanel from "./AuthPanel.tsx";
import {
    renderWithProviders,
    screen,
    within,
} from "../../../test/test-utils.tsx";
import { server } from "../../../test/mocks/server.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

describe("AuthPanel Component", () => {
    it("switches between Login and Signup screens via top tabs", async () => {
        const { user } = renderWithProviders(<AuthPanel />);

        // Initial view is Login
        expect(
            screen.getByRole("heading", { name: /welcome back/i }),
        ).toBeInTheDocument();

        // Switch to Signup via top tab (first button named "Sign up")
        const signupTab = screen.getAllByRole("button", { name: /^sign up$/i })[0];
        await user.click(signupTab);

        expect(
            screen.getByRole("heading", { name: /start your journey/i }),
        ).toBeInTheDocument();

        // Switch back to Login via top tab (first button named "Log in")
        const loginTab = screen.getAllByRole("button", { name: /^log in$/i })[0];
        await user.click(loginTab);

        expect(
            screen.getByRole("heading", { name: /welcome back/i }),
        ).toBeInTheDocument();
    });

    it("switches between screens using footer links", async () => {
        const { user } = renderWithProviders(<AuthPanel />);

        // On Login screen, click footer link inside "Don't have an account?"
        const loginFooter = screen.getByText(/don't have an account\?/i);
        const toSignupFooterBtn = within(loginFooter).getByRole("button", {
            name: /^sign up$/i,
        });
        await user.click(toSignupFooterBtn);

        expect(
            screen.getByRole("heading", { name: /start your journey/i }),
        ).toBeInTheDocument();

        // On Signup screen, click footer link inside "Already have an account?"
        const signupFooter = screen.getByText(/already have an account\?/i);
        const toLoginFooterBtn = within(signupFooter).getByRole("button", {
            name: /^log in$/i,
        });
        await user.click(toLoginFooterBtn);

        expect(
            screen.getByRole("heading", { name: /welcome back/i }),
        ).toBeInTheDocument();
    });

    it("transitions from Signup to Login screen upon successful signup", async () => {
        server.use(
            http.post(`${API_URL}/auth/signup`, () => {
                return HttpResponse.json({ message: "Success" });
            }),
        );

        const { user, container } = renderWithProviders(<AuthPanel />);

        // Go to Signup screen via top tab
        const signupTab = screen.getAllByRole("button", { name: /^sign up$/i })[0];
        await user.click(signupTab);
        expect(
            screen.getByRole("heading", { name: /start your journey/i }),
        ).toBeInTheDocument();

        // Fill and submit signup form
        await user.type(screen.getByPlaceholderText(/your name/i), "Test User");
        await user.type(
            screen.getByPlaceholderText(/you@example\.com/i),
            "test@example.com",
        );
        await user.type(
            screen.getByPlaceholderText(/enter your password/i),
            "password123",
        );

        // Submit form via the button inside the form element
        const formElement = container.querySelector("form")!;
        const submitBtn = within(formElement).getByRole("button", {
            name: /^sign up$/i,
        });
        await user.click(submitBtn);

        // Verify transitioned back to Login screen
        expect(
            await screen.findByRole("heading", { name: /welcome back/i }),
        ).toBeInTheDocument();
    });
});
