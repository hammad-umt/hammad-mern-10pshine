'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useFetchNoteByIdQuery } from '@/hooks/useNotes'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { DeleteNoteDialog } from '@/components/notes/dialogs/DeleteNoteDialog'
import { ViewNoteSkeleton } from '@/components/skeletons/ViewNotesSkeleton'

export default function ViewNotePage() {
  const { id } = useParams<{ id: string }>()
  const { data: note, isLoading, error } = useFetchNoteByIdQuery(id)
  const [openDelete, setOpenDelete] = React.useState(false)
  const handleOpenDelete = (noteId: string) => {
    setOpenDelete(true)
  }
  if (isLoading) {
    return (
      <ViewNoteSkeleton />
    )
  }

  if (error || !note) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">Failed to load note.</p>
      </main>
    )
  }

  const tagsArray = note.tag
    ? note.tag.split(',').map((t) => t.trim())
    : []

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {note.title}
          </h1>

          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tagsArray.map((t, i) => {
                const colors = [
                  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
                  "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
                  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
                  "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
                  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
                  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
                ];

                // Pick a color based on the index, wrapping around if there are more tags than colors
                const colorClass = colors[i % colors.length];

                return (
                  <span
                    key={t}
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${colorClass}`}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="ml-4 flex gap-2">
          {/* Edit Button */}
          <Button
            onClick={() => window.location.href = `/notes/edit/${note._id}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </Button>

          {/* Delete Button opens dialog */}
          <Button
            variant="destructive"
            onClick={() => handleOpenDelete(note._id)}
            className="rounded-lg px-4 py-2 flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </header>

      {/* Note Card */}
      <section
        className="rounded-2xl border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800 p-6 shadow-md transition-shadow
                   hover:shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
          Description
        </h2>

        <div
          className="prose max-w-full text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: note.description }}
        />

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-sm text-gray-500">
          <p>
            <span className="font-medium">Note ID:</span> {note._id}
          </p>
          <p>
            <span className="font-medium">Created:</span>{' '}
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      </section>
      {/* Delete Note Dialog */}
      <DeleteNoteDialog
        noteId={note._id}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </main>
  )
}
