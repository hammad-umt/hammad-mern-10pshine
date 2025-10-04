import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteNoteMutation } from "@/hooks/useNotes";
import { toast } from "sonner";
import React from "react";

interface DeleteNoteDialogProps {
  noteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: if parent wants to do something after delete */
  onDeleted?: () => void;
}

export function DeleteNoteDialog({
  noteId,
  open,
  onOpenChange,
  onDeleted,
}: DeleteNoteDialogProps) {
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await deleteNote({ id: noteId }).unwrap();
      onOpenChange(false);
      toast.success("Note deleted successfully");
      onDeleted?.();
    } catch (err) {
      toast.error("Error deleting note. Please try again.");
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The button that opens the dialog must be wrapped in DialogTrigger from the parent */}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" type="submit" disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
