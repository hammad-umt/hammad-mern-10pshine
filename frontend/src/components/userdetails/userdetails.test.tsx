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

// Mock skeleton component
jest.mock("../skeletons/UserSkeleton", () => ({
  UserDetailsSkeleton: () => (
    <div data-testid="user-skeleton">
      <button disabled>Logging out...</button>
      <div>Loading user details...</div>
    </div>
  ),
}))

// Mock error screen component  
jest.mock("./ErrorScreen", () => ({
  UserErrorScreen: () => (
    <div data-testid="user-error-screen">
      <h2>Oops! Something went wrong 😕</h2>
      <p>We couldn&apos;t fetch your profile details right now. Please check your internet connection or try again in a moment.</p>
      <button>Go Back</button>
    </div>
  ),
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
  useGetUserQuery: () => mockGetUserQuery(),
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
    expect(screen.getByTestId("user-skeleton")).toBeInTheDocument()
    expect(screen.getByText("Logging out...")).toBeInTheDocument()
    expect(screen.getByText("Loading user details...")).toBeInTheDocument()
  })

  it("renders error state when there is an error", () => {
    mockGetUserQuery.mockReturnValue({
      data: null,
      error: true,
      isLoading: false,
    })

    render(<UserDetails />)
    expect(screen.getByTestId("user-error-screen")).toBeInTheDocument()
    expect(screen.getByText("Oops! Something went wrong 😕")).toBeInTheDocument()
    expect(screen.getByText("We couldn't fetch your profile details right now. Please check your internet connection or try again in a moment.")).toBeInTheDocument()
    expect(screen.getByText("Go Back")).toBeInTheDocument()
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
      name: "John Doe",
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
      name: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const nameInput = screen.getByDisplayValue("John Doe") as HTMLInputElement
    const emailInput = screen.getByDisplayValue("john.doe@example.com") as HTMLInputElement

    // Only name is editable (email is disabled in the component)
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })

    expect(nameInput).toHaveValue("Jane Doe")
    // email should remain unchanged and disabled
    expect(emailInput).toHaveValue("john.doe@example.com")
    expect(emailInput).toBeDisabled()
  })

  it("handles profile update successfully", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      image: "",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const nameInput = screen.getByDisplayValue("John Doe")
    const saveButton = screen.getByText("Save Details")

    // change only the editable name field
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      // component sends only the formData (name and image)
      expect(mockUpdateUserMutation).toHaveBeenCalledWith({
        name: "Jane Doe",
        image: "",
      })
      expect(toast.success).toHaveBeenCalledWith("Profile updated successfully")
    })
  })

  it("handles password form input changes", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByPlaceholderText("Current Password") as HTMLInputElement
    const newPasswordInput = screen.getByPlaceholderText("New Password") as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password") as HTMLInputElement

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } })

    expect(currentPasswordInput).toHaveValue("oldpassword")
    expect(newPasswordInput).toHaveValue("newpassword")
    expect(confirmPasswordInput).toHaveValue("newpassword")
  })

  it("handles password update successfully", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByPlaceholderText("Current Password") as HTMLInputElement
    const newPasswordInput = screen.getByPlaceholderText("New Password") as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password") as HTMLInputElement
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
      expect(toast.success).toHaveBeenCalledWith("Password updated successfully")
    })
  })

  it("shows error when passwords do not match", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
    }

    mockGetUserQuery.mockReturnValue({
      data: userData,
      error: null,
      isLoading: false,
    })

    render(<UserDetails />)

    const currentPasswordInput = screen.getByPlaceholderText("Current Password") as HTMLInputElement
    const newPasswordInput = screen.getByPlaceholderText("New Password") as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password") as HTMLInputElement
    const updatePasswordButton = screen.getByText("Update Password")

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } })
    fireEvent.click(updatePasswordButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match")
      expect(mockChangePasswordMutation).not.toHaveBeenCalled()
    })
  })

  it("handles password update error", async () => {
    const userData = {
      name: "John Doe",
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

    const currentPasswordInput = screen.getByPlaceholderText("Current Password") as HTMLInputElement
    const newPasswordInput = screen.getByPlaceholderText("New Password") as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm New Password") as HTMLInputElement
    const updatePasswordButton = screen.getByText("Update Password")

    fireEvent.change(currentPasswordInput, { target: { value: "wrongpassword" } })
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } })
    fireEvent.click(updatePasswordButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update password")
    })
  })

  it("handles logout functionality", async () => {
    const userData = {
      name: "John Doe",
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
