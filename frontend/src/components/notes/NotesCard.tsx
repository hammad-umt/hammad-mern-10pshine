'use client';

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { DeleteNoteDialog } from "./dialogs/DeleteNoteDialog";
import { useRouter } from "next/navigation";
import striptags from 'striptags';

interface NoteCardProps {
  note: {
    _id: string;
    user: string;
    title: string;
    description: string;
    tag: string;
    createdAt: string;
  };
}

export const NotesCard: React.FC<NoteCardProps> = ({ note }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const router = useRouter();

  const viewNote = (id: string) => router.push(`/notes/${id}`);
  const editNote = (id: string) => router.push(`/notes/edit/${id}`);
  const tagsArray = note.tag
    ? note.tag.split(',').map((t) => t.trim())
    : []
  console.log(tagsArray)

  return (
    <div
      data-aos="fade-right"
      data-aos-duration="800"
      data-aos-once="true"
      onClick={() => viewNote(note._id)}
      className="max-w-sm w-full rounded-xl border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md hover:scale-101
                 transition-transform cursor-pointer flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight"
            title={note.title}
          >
            {note.title}
          </h2>

          {/* Tags */}
          <div className="mt-1 flex flex-wrap gap-1">
            {tagsArray.map((t, i) => {
              const colors = [
                "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
                "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
                "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
                "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
                "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
              ]

              // Pick a color based on the index, wrapping around if there are more tags than colors
              const colorClass = colors[i % colors.length]

              return (
                <span
                  key={t}
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
                >
                  {t}
                </span>
              )
            })}
          </div>

        </div>

        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Description with uniform height */}
      <div
        className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 max-w-full mb-4 line-clamp-3"
        title={striptags(note.description)} // tooltip shows full text
      >
        {striptags(note.description)}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            editNote(note._id);
          }}
          className="flex items-center gap-1 rounded-md border border-gray-300
                     dark:border-gray-600 px-3 py-1 text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Edit note ${note.title}`}
        >
          <Edit size={16} />
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDialogOpen(true);
          }}
          className="flex items-center gap-1 rounded-md border border-red-300
                     dark:border-red-600 px-3 py-1 text-red-600 dark:text-red-400
                     hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          aria-label={`Delete note ${note.title}`}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* Dialog */}
      <div onClick={(e) => e.stopPropagation()}>
        <DeleteNoteDialog
          noteId={note._id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDeleted={() => console.log(`Note ${note._id} deleted`)}
        />
      </div>
    </div>
  );
};
