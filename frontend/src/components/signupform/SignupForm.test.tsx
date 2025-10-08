// Removed ts-nocheck to allow proper linting and type checking
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SignupForm } from "./SignupForm";
import authReducer from "@/slice/authSlice";

// ------------------ MOCKS ------------------

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
import { toast as mockToast } from "sonner";

// Mock useSingUpMutation hook
jest.mock("@/hooks/useAuth", () => ({
  useSingUpMutation: () => {
    type FormData = { name?: string; email?: string; password?: string; confirmPassword?: string } | unknown;
    const mutateFn = jest.fn((formData: FormData) => ({
      unwrap: jest.fn().mockImplementation(() => {
        const fd = formData as { name?: string; email?: string; password?: string; confirmPassword?: string };
        const { name, email, password, confirmPassword } = fd;
        if (!name || !email || !password || !confirmPassword) {
          return Promise.reject(new Error("Invalid input"));
        }
        if (password !== confirmPassword) {
          return Promise.reject(new Error("Passwords do not match"));
        }
        return Promise.resolve({ authToken: "mockAuthToken" });
      }),
    }));
    return [mutateFn, { isLoading: false }];
  },
}));

// ------------------ HELPER ------------------
const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
};

// ------------------ TEST SUITE ------------------
describe("SignupForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields and submit button", () => {
    renderWithProvider(<SignupForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  test("shows error if passwords do not match", async () => {
    renderWithProvider(<SignupForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "654321" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Passwords do not match!");
    });
  });

  test("handles successful signup", async () => {
    renderWithProvider(<SignupForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("Signup successful!");
      expect(mockPush).toHaveBeenCalledWith("/userDetails");
    });
  });
});
