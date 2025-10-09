// Removed ts-nocheck to allow proper linting and type checking
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import EditNotePage from "./page"

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
  const MockedEditor = React.forwardRef<HTMLTextAreaElement, { value?: string; onChange?: (v: string) => void; className?: string; placeholder?: string }>(({
    value,
    onChange,
    className,
    placeholder,
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange && typeof onChange === "function") {
        onChange(e.target.value)
      }
    }
    return (
      <textarea
        ref={ref}
        data-testid="editor-placeholder"
        value={value || ""}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
      />
    )
  })
  MockedEditor.displayName = 'MockedMinimalTiptapEditor'
  return MockedEditor
})

// MOCK hooks
const mockEditNoteMutation = jest.fn(() => ({
  unwrap: jest.fn().mockResolvedValue({}),
}))
const mockFetchNoteByIdQuery = jest.fn()

jest.mock("@/hooks/useNotes", () => ({
  useFetchNoteByIdQuery: (id: string) => mockFetchNoteByIdQuery(id),
  useEditNoteMutation: () => [mockEditNoteMutation],
}))

describe("EditNotePage Component", () => {
  const mockRouterPush = jest.fn()
  const mockRouterBack = jest.fn()

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
    })
    jest.clearAllMocks()
  })

  it("renders loading state", () => {
    mockFetchNoteByIdQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)
    expect(screen.getByText("Loading note…")).toBeInTheDocument()
  })

  it("displays 'Failed to load note.' if note is missing", async () => {
    mockFetchNoteByIdQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: true,
    })

    render(<EditNotePage params={{ id: "1" }} />)
    expect(await screen.findByText("Failed to load note.")).toBeInTheDocument()
  })

  it("renders editor placeholder and buttons with correct title and tags", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const titleInput = await screen.findByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = await screen.findByTestId("editor-placeholder")

    expect(titleInput).toHaveValue("Test Note")
    expect(tagsInput).toHaveValue("tag1,tag2")
    expect(editor).toHaveValue("Hello World")
    expect(screen.getByText("Save Changes")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
  })

  it("updates input values when typing", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const titleInput = await screen.findByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = await screen.findByTestId("editor-placeholder")

    fireEvent.change(titleInput, { target: { value: "Updated Title" } })
    fireEvent.change(tagsInput, { target: { value: "newtag1,newtag2" } })
    fireEvent.change(editor, { target: { value: "Updated Description" } })

    expect(titleInput).toHaveValue("Updated Title")
    expect(tagsInput).toHaveValue("newtag1,newtag2")
    expect(editor).toHaveValue("Updated Description")
  })

  it("calls edit mutation and navigates when save changes is clicked", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const titleInput = await screen.findByPlaceholderText("Enter note title")
    const tagsInput = screen.getByPlaceholderText("Add tags separated by commas")
    const editor = await screen.findByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Changes")

    fireEvent.change(titleInput, { target: { value: "Final Title" } })
    fireEvent.change(tagsInput, { target: { value: "finalTag" } })
    fireEvent.change(editor, { target: { value: "updated description" } })

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockEditNoteMutation).toHaveBeenCalledWith({
        id: "1",
        title: "Final Title",
        description: "updated description",
        tag: "finalTag",
      })
      expect(mockRouterPush).toHaveBeenCalledWith("/notes")
      expect(toast.success).toHaveBeenCalledWith("Note updated successfully!")
    })
  })

  it("shows error when title is empty", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const titleInput = await screen.findByPlaceholderText("Enter note title")
    const saveButton = screen.getByText("Save Changes")

    // Clear title
    fireEvent.change(titleInput, { target: { value: "" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Title cannot be empty")
      expect(mockEditNoteMutation).not.toHaveBeenCalled()
    })
  })

  it("shows error when description is empty", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const editor = await screen.findByTestId("editor-placeholder")
    const saveButton = screen.getByText("Save Changes")

    // Clear description
    fireEvent.change(editor, { target: { value: "" } })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Description cannot be empty")
      expect(mockEditNoteMutation).not.toHaveBeenCalled()
    })
  })

  it("handles save error gracefully", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    // Mock edit mutation to throw error
    const mockEditMutationError = jest.fn(() => ({
      unwrap: jest.fn().mockRejectedValue(new Error("Network error")),
    }))
    
    // Override the mock for this test
    mockEditNoteMutation.mockImplementation(() => ({
      unwrap: jest.fn().mockRejectedValue(new Error("Network error")),
    }))

    render(<EditNotePage params={{ id: "1" }} />)

    const saveButton = await screen.findByText("Save Changes")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update note. Please try again.")
    })
  })

  it("navigates back when cancel is clicked", async () => {
    const note = {
      _id: "1",
      title: "Test Note",
      description: "Hello World",
      tag: "tag1,tag2",
    }
    mockFetchNoteByIdQuery.mockReturnValue({
      data: note,
      isLoading: false,
      error: null,
    })

    render(<EditNotePage params={{ id: "1" }} />)

    const cancelButton = await screen.findByText("Cancel")
    fireEvent.click(cancelButton)

    expect(mockRouterBack).toHaveBeenCalled()
  })
})
