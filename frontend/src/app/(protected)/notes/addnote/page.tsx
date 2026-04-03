'use client'

import { useState } from "react"
import { Content } from "@tiptap/react"
import MinimalTiptapEditor from "@/components/ui/minimal-tiptap/minimal-tiptap"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAddNoteMutation } from "@/hooks/useNotes"
const AddNote: React.FC = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState<Content>("")
  const [tags, setTags] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [addNote] = useAddNoteMutation()

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title.")
      return
    }
    if (!description || description === "") {
      toast.error("Please enter a description.")
      return
    }

    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t)

    setLoading(true)
    try {
      const res = await addNote({
        title,
        description: description as string, // HTML from TipTap
        tag: tagsArray.join(",") // backend expects comma-separated string
      }).unwrap()

      try{
        toast.success("Note created successfully.")
        // Reset fields
        setTitle("")
        setDescription("")
        setTags("")
        router.push("/notes") // navigate to notes list
      } catch {
        toast.error("Your note was saved, but we couldn't refresh the page.")
      }
    } catch {
      toast.error("Unable to create note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-10 border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-900">
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
          onChange={setDescription}
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
          className="rounded-md dark:bg-blue-500 text-white dark:text-grey-100 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  )
}

export default AddNote
