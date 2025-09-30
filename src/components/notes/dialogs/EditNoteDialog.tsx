"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditNoteMutation } from "@/hooks/useNotes";
import { toast } from "sonner";

interface EditNoteDialogProps {
    note: {
        _id: string;
        user: string;
        title: string;
        description: string; // HTML content
        tag: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdited?: () => void;
}

export function EditNoteDialog({
    note,
    open,
    onOpenChange,
    onEdited,
}: EditNoteDialogProps) {
    const [editNoteMutation, { isLoading }] = useEditNoteMutation();

    // State to store editable HTML content
    const [htmlDescription, setHtmlDescription] = useState(note.description);

    useEffect(() => {
        setHtmlDescription(note.description);
    }, [note.description]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const tag = formData.get("tag") as string;

        try {
            await editNoteMutation({
                id: note._id,
                title,
                description: htmlDescription, // send HTML content
                tag,
            }).unwrap();

            toast.success("✅ Note updated successfully!");
        } catch (err) {
            toast.error("⚠️ Failed to update note. Please try again.");
            console.error("Edit note error:", err);
        }

        onEdited?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                        <DialogDescription>
                            Edit your note content below. HTML formatting is preserved.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Title Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                            defaultValue={note.title}
                        />
                    </div>

                    {/* Editable HTML Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <div className="relative w-full">
                            <div
                                id="description"
                                contentEditable={true}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
               min-h-[120px] resize-y"
                                onInput={(e) =>
                                    setHtmlDescription((e.target as HTMLDivElement).innerHTML)
                                }
                                dangerouslySetInnerHTML={{ __html: htmlDescription }}
                            />

                            {/* Placeholder */}
                            {htmlDescription === "" && (
                                <span className="absolute top-2 left-3 text-muted-foreground pointer-events-none text-sm">
                                    Write your note description...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Tag Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="tag">Tag</Label>
                        <Input
                            id="tag"
                            name="tag"
                            defaultValue={note.tag}
                        />
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
