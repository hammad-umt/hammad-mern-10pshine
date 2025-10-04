// src/components/loginform/login-form.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { LoginForm } from "./login-form";
import authReducer from "@/slice/authSlice";

// ------------------ MOCKS ------------------
// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Grab mock toast for assertions
import { toast as mockToast } from "sonner";

// Mock useLoginMutation hook
jest.mock("@/hooks/useAuth", () => ({
  useLoginMutation: () => [
    jest.fn(({ email, password }: { email: string; password: string }) => ({
      unwrap: jest.fn().mockImplementation(() => {
        if (email === "user@example.com" && password === "secure123") {
          return Promise.resolve({ authToken: "fakeToken" });
        } else {
          return Promise.reject("Invalid credentials");
        }
      }),
    })),
    { isLoading: false },
  ],
}));

// Helper to render component with Redux store
const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

// ------------------ TEST SUITE ------------------
describe("LoginForm Component", () => {
  // Suppress console logs/errors during tests
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all UI elements correctly", () => {
    renderWithProvider(<LoginForm />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows typing into email and password fields", () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>(/email/i);
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secure123" } });

    expect(emailInput.value).toBe("user@example.com");
    expect(passwordInput.value).toBe("secure123");
  });

  test("handles successful login correctly", async () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>(/email/i);
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const submitButton = screen.getByRole<HTMLButtonElement>("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secure123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("Login successful!");
    });
  });

  test("shows error toast for wrong credentials", async () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText<HTMLInputElement>(/email/i);
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const submitButton = screen.getByRole<HTMLButtonElement>("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Login failed! Check credentials.");
    });
  });

  test("toggles password visibility", () => {
    renderWithProvider(<LoginForm />);

    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const toggleButton = screen.getByRole("button", { name: "" });

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });
});
