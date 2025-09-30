'use client'

import { useParams } from 'next/navigation'
import { useFetchNoteByIdQuery } from '@/hooks/useNotes'

export default function ViewNotePage() {
  const { id } = useParams<{ id: string }>()
  const { data: note, isLoading, error } = useFetchNoteByIdQuery(id)

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading note…</p>
      </main>
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
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {note.title}
        </h1>

        {tagsArray.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {tagsArray.map((t) => (
              <span
                key={t}
                className="inline-block rounded-full bg-blue-100 dark:bg-blue-900
                           px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-200"
              >
                {t}
              </span>
            ))}
          </div>
        )}
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

        {/* TipTap HTML with prose */}
        <div
          className="prose max-w-full text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: note.description }}
        />

        {/* Footer */}
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
    </main>
  )
}
