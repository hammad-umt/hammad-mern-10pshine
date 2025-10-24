// src/components/DeleteNoteDialog/DeleteNoteDialog.test.tsx
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

// ------------------ MOCKS ------------------

// Mock the delete hook
const mockDeleteNote = jest.fn(() => ({
  unwrap: () => Promise.resolve({}) // resolves like the real mutation
}));

jest.mock("@/hooks/useNotes", () => ({
  useDeleteNoteMutation: () => [mockDeleteNote, { isLoading: false }],
}));

// ------------------ HELPER ------------------
const renderWithProvider = (ui: React.ReactElement) => {
  // No Redux store needed as the component only relies on props
  return render(ui);
};

// ------------------ TEST SUITE ------------------
describe("DeleteNoteDialog Component", () => {
  const mockOnClose = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog with correct title and buttons", () => {
    renderWithProvider(
      <DeleteNoteDialog
        open={true}
        onOpenChange={mockOnClose}
        onDeleted={mockOnDelete}
        noteId=""
      />
    );

    expect(
      screen.getByText(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  test("calls onOpenChange when Cancel button is clicked", () => {
    renderWithProvider(
      <DeleteNoteDialog
        open={true}
        onOpenChange={mockOnClose}
        onDeleted={mockOnDelete}
        noteId=""
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onDeleted when Delete button is clicked", async () => {
    renderWithProvider(
      <DeleteNoteDialog
        open={true}
        onOpenChange={mockOnClose}
        onDeleted={mockOnDelete}
        noteId={"123"}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith({ id: "123" });
      expect(mockOnDelete).toHaveBeenCalled();
    });
  });
});
