'use client'

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import MinimalTiptapEditor from "@/components/ui/minimal-tiptap/minimal-tiptap"
import { useFetchNoteByIdQuery, useEditNoteMutation } from "@/hooks/useNotes"

interface EditNotePageProps {
  params: Promise<{
    id: string
  }>
}

const EditNotePage: React.FC<EditNotePageProps> = ({ params }) => {
  const { id } = React.use(params)
  const router = useRouter()

  // Fetch existing note
  const { data: note, isLoading, error } = useFetchNoteByIdQuery(id)

  const [editNote] = useEditNoteMutation()

  // Local state for editable fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  // Populate state when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setDescription(note.description) // HTML content
      setTags(note.tag)
    }
  }, [note])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading note…</p>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">Failed to load note.</p>
      </div>
    )
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty")
      return
    }
    if (!description || description === "") {
      toast.error("Description cannot be empty")
      return
    }

    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t)

    setLoading(true)
    try {
      await editNote({
        id: note._id,
        title,
        description, // TipTap HTML content
        tag: tagsArray.join(",")
      }).unwrap()

      toast.success("Note updated successfully!")
      router.push("/notes") // navigate back to notes list
    } catch (err) {
      console.error(err)
      toast.error("Failed to update note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-10 border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6">Edit Note</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <MinimalTiptapEditor
          value={description}
          onChange={() => setDescription}
          className="w-full editor-content border rounded-md"
          editorContentClassName="p-4 min-h-[200px]"
          output="html"
          placeholder="Enter note description..."
          editable
          editorClassName="focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags separated by commas"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="destructive" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="rounded-md text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

export default EditNotePage
