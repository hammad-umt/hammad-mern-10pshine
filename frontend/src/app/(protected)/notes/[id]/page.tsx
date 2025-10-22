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
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="mx-auto max-w-lg w-full bg-white dark:bg-gray-900 shadow-xl dark:shadow-[0_0_30px_rgba(0,0,0,0.4)] rounded-2xl p-10 text-center border border-gray-200 dark:border-gray-700">
        
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-indigo-100 dark:bg-indigo-800/40 text-indigo-600 dark:text-indigo-300 p-4 rounded-full inline-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="42"
              height="42"
              role="img"
              aria-labelledby="notefoundTitle notefoundDesc"
              fill="none"
            >
              <title id="notefoundTitle">No note found</title>
              <desc id="notefoundDesc">
                Icon of a document with a magnifying glass indicating search/no result
              </desc>
              <path
                d="M16 8h22l10 10v28a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="currentColor"
                className="fill-white dark:fill-gray-900"
              />
              <path
                d="M38 8v12h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M22 26h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              <path d="M22 32h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
              <path d="M22 38h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
              <circle cx="44" cy="42" r="7.5" stroke="currentColor" strokeWidth="2" />
              <path d="M49.5 47.5 L56 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Oops! No Note Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The note you’re looking for doesn’t exist or may have been deleted.
        </p>

        {/* Button */}
        <Button
          onClick={() => (window.location.href = "/notes")}
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Back to Notes
        </Button>
      </div>
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
