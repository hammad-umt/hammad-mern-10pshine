import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserDetails } from "./UserDetails"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock hooks
const mockGetUserQuery = jest.fn()
const mockUpdateUserMutation = jest.fn(() => ({
  unwrap: jest.fn().mockResolvedValue({}),
}))
const mockChangePasswordMutation = jest.fn(() => ({
  unwrap: jest.fn().mockResolvedValue({}),
}))

jest.mock("@/hooks/useAuth", () => ({
  useGetUserQuery: (arg: any, options: any) => mockGetUserQuery(arg, options),
  useUpdateUserMutation: () => [mockUpdateUserMutation, { isLoading: false }],
  useChangePasswordMutation: () => [mockChangePasswordMutation, { isLoading: false }],
}))

describe("UserDetails Component", () => {
  const mockRouterPush = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    })
    jest.clearAllMocks()
  })

  it("renders loading state initially", () => {
    mockGetUserQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    render(<UserDetails />)
    expect(screen.getByText("⏳ Loading User Details...")).toBeInTheDocument()
  })

  it("renders error state when there is an error", () => {
    mockGetUserQuery.mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
    })

    render(<UserDetails />)
    expect(screen.getByText("⚠ Error Fetching User Details")).toBeInTheDocument()
  })

  it("renders no data state when user data is null", () => {
    mockGetUserQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)
    expect(screen.getByText("No user data found")).toBeInTheDocument()
  })

  it("renders user details when data is available", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    expect(screen.getByText("User Details")).toBeInTheDocument()
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument()
    expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument()
    expect(screen.getByText("J")).toBeInTheDocument() // Avatar initial
    expect(screen.getByText("Logout")).toBeInTheDocument()
  })

  it("handles profile form input changes", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const nameInput = screen.getByDisplayValue("John Doe")
    const emailInput = screen.getByDisplayValue("john.doe@example.com")

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })
    fireEvent.change(emailInput, { target: { value: "jane.doe@example.com" } })

    expect(nameInput).toHaveValue("Jane Doe")
    expect(emailInput).toHaveValue("jane.doe@example.com")
  })

  it("handles profile update successfully", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const nameInput = screen.getByDisplayValue("John Doe")
    const emailInput = screen.getByDisplayValue("john.doe@example.com")
    const saveButton = screen.getByText("Save Details")

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })
    fireEvent.change(emailInput, { target: { value: "jane.doe@example.com" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockUpdateUserMutation).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane.doe@example.com",
      })
      expect(toast.success).toHaveBeenCalledWith("User details updated successfully")
    })
  })

  it("handles password form input changes", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByLabelText("Current Password")
    const newPasswordInput = screen.getByLabelText("New Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password")

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } })

    expect(currentPasswordInput).toHaveValue("oldpassword")
    expect(newPasswordInput).toHaveValue("newpassword")
    expect(confirmPasswordInput).toHaveValue("newpassword")
  })

  it("handles password update successfully", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByLabelText("Current Password")
    const newPasswordInput = screen.getByLabelText("New Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password")
    const updatePasswordButton = screen.getByText("Update Password")

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } })
    fireEvent.click(updatePasswordButton)

    await waitFor(() => {
      expect(mockChangePasswordMutation).toHaveBeenCalledWith({
        oldPassword: "oldpassword",
        newPassword: "newpassword",
      })
      expect(toast.success).toHaveBeenCalledWith("Password updated ")
    })
  })

  it("shows error when passwords do not match", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByLabelText("Current Password")
    const newPasswordInput = screen.getByLabelText("New Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password")
    const updatePasswordButton = screen.getByText("Update Password")

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } })
    fireEvent.click(updatePasswordButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match ❌")
      expect(mockChangePasswordMutation).not.toHaveBeenCalled()
    })
  })

  it("handles password update error", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    // Mock password change to throw error
    mockChangePasswordMutation.mockImplementationOnce(() => ({
      unwrap: jest.fn().mockRejectedValue(new Error("Invalid password")),
    }))

    render(<UserDetails />)

    const currentPasswordInput = screen.getByLabelText("Current Password")
    const newPasswordInput = screen.getByLabelText("New Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm New Password")
    const updatePasswordButton = screen.getByText("Update Password")

    fireEvent.change(currentPasswordInput, { target: { value: "wrongpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } })
    fireEvent.click(updatePasswordButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update password ")
    })
  })

  it("handles logout functionality", async () => {
    const userData = {
      username: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    // Mock localStorage
    const localStorageMock = {
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    })

    render(<UserDetails />)

    const logoutButton = screen.getByText("Logout")
    fireEvent.click(logoutButton)

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token")
    expect(mockRouterPush).toHaveBeenCalledWith("/auth/login")
    expect(toast.success).toHaveBeenCalledWith("Logged out")
  })
})
