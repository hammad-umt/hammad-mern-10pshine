'use client';
import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useGetNotesQuery } from "@/hooks/useNotes";
import { NotesCard } from "./NotesCard";
import { useRouter } from "next/navigation";

const Notes: React.FC = () => {
  const { data, error, isLoading } = useGetNotesQuery();
  const router = useRouter();
  const notes = data || [];
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Notes Overview
        </h1>
        <Button
          onClick={() => {
            router.push("/addnote");
          }}
          className="gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          <Plus size={18} />
          Add New Note
        </Button>
      </div>

      {/* Status Handling */}
      {isLoading && (
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading notes...
        </p>
      )}

      {error && (
        <p className="text-red-500 dark:text-red-400">
          Failed to load notes. Please try again.
        </p>
      )}

      {/* Notes Grid */}
      {!isLoading && !error && (
        <>
          {notes.length === 0 ? (
            <p className="italic text-gray-500 dark:text-gray-400">
              No notes yet. Click “Add New Note” to get started.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NotesCard key={note._id} note={note} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Notes;
