import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import AddNote from "./page"

// MOCK next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

// MOCK toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// MOCK TIPTAP (properly)
jest.mock('@/components/ui/minimal-tiptap/minimal-tiptap', () => {
  return React.forwardRef<HTMLDivElement, any>(({ value, onChange, className, placeholder }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange && typeof onChange === "function") {
        onChange(e.target.value)
      }
    }
    return (
      <textarea
        ref={ref as any}
        data-testid="editor-placeholder"
        value={value || ""}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
      />
    )
  })
})

// MOCK hooks
const mockAddNoteMutation = jest.fn(() => ({
  unwrap: jest.fn().mockResolvedValue({}),
}))

jest.mock("@/hooks/useNotes", () => ({
  useAddNoteMutation: () => [mockAddNoteMutation],
}))

describe("AddNote Component", () => {
  const mockRouterPush = jest.fn()
  const mockRouterBack = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    })
    jest.clearAllMocks()
  })

  it("renders add note form with all fields", () => {
    render(<AddNote />)

    expect(screen.getByPlaceholderText("Enter note title")).toBeInTheDocument()
    expect(screen.getByTestId("editor-placeholder")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Add tags separated by commas")).toBeInTheDocument()
    expect(screen.getByText("Save Note")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
  })

  it("updates input values when typing", async () => {
    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = screen.getByTestId("editor-placeholder")

    fireEvent.change(titleInput, { target: { value: "Test Title" } })
    fireEvent.change(tagsInput, { target: { value: "tag1,tag2" } })
    fireEvent.change(editor, { target: { value: "Test Description" } })

    expect(titleInput).toHaveValue("Test Title")
    expect(tagsInput).toHaveValue("tag1,tag2")
    expect(editor).toHaveValue("Test Description")
  })

  it("shows error when title is empty", async () => {
    render(<AddNote />)

    const saveButton = screen.getByText("Save Note")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Title cannot be empty")
      expect(mockAddNoteMutation).not.toHaveBeenCalled()
    })
  })

  it("shows error when description is empty", async () => {
    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const saveButton = screen.getByText("Save Note")

    fireEvent.change(titleInput, { target: { value: "Test Title" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Description cannot be empty")
      expect(mockAddNoteMutation).not.toHaveBeenCalled()
    })
  })

  it("calls add mutation and navigates when save is clicked with valid data", async () => {
    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = screen.getByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Note")

    fireEvent.change(titleInput, { target: { value: "New Note Title" } })
    fireEvent.change(tagsInput, { target: { value: "work,project" } })
    fireEvent.change(editor, { target: { value: "Note description content" } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockAddNoteMutation).toHaveBeenCalledWith({
        title: "New Note Title",
        description: "Note description content",
        tag: "work,project",
      })
      expect(mockRouterPush).toHaveBeenCalledWith("/notes")
      expect(toast.success).toHaveBeenCalledWith("Note added successfully!")
    })
  })

  it("handles save error gracefully", async () => {
    // Mock add mutation to throw error
    mockAddNoteMutation.mockImplementationOnce(() => ({
      unwrap: jest.fn().mockRejectedValue(new Error("Network error")),
    }))

    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const editor = screen.getByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Note")

    fireEvent.change(titleInput, { target: { value: "Test Title" } })
    fireEvent.change(editor, { target: { value: "Test Description" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong")
    })
  })

  it("navigates back when cancel is clicked", () => {
    render(<AddNote />)

    const cancelButton = screen.getByText("Cancel")
    fireEvent.click(cancelButton)

    expect(mockRouterBack).toHaveBeenCalled()
  })

  it("shows loading state when saving", async () => {
    // Mock a delayed response
    mockAddNoteMutation.mockImplementationOnce(() => ({
      unwrap: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
    }))

    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const editor = screen.getByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Note")

    fireEvent.change(titleInput, { target: { value: "Test Title" } })
    fireEvent.change(editor, { target: { value: "Test Description" } })
    fireEvent.click(saveButton)

    expect(screen.getByText("Saving...")).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
  })

  it("resets form fields after successful save", async () => {
    render(<AddNote />)

    const titleInput = screen.getByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = screen.getByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Note")

    fireEvent.change(titleInput, { target: { value: "Test Title" } })
    fireEvent.change(tagsInput, { target: { value: "test,tags" } })
    fireEvent.change(editor, { target: { value: "Test Description" } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(titleInput).toHaveValue("")
      expect(tagsInput).toHaveValue("")
      expect(editor).toHaveValue("")
    })
  })
})