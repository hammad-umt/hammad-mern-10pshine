"use client";
import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { useGetNotesQuery } from "@/hooks/useNotes";
import { NotesCard } from "./NotesCard";
import { useRouter } from "next/navigation";
import { NotesSkeleton } from "../skeletons/DashboardSkeleton";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const Notes: React.FC = () => {
  const router = useRouter();
  const { data, error, isLoading } = useGetNotesQuery();
  const notes = data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // ✅ Added sort state

  // ------------------ UNIQUE TAGS ------------------
  const allTags = notes.flatMap((note) =>
    note.tag
      ? note.tag.split(",").map((t: string) => t.trim()).filter(Boolean)
      : []
  );
  const uniqueTags = Array.from(new Set(allTags));

  // ------------------ FILTERED + SORTED NOTES ------------------
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter((note) => {
      const tagsArray = note.tag
        ? note.tag.split(",").map((t: string) => t.trim().toLowerCase())
        : [];

      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tagsArray.some((t: string) =>
          t.includes(searchQuery.toLowerCase())
        );

      const matchesTag =
        filterTag === "all" ||
        tagsArray.some((t: string) => t === filterTag.toLowerCase());

      return matchesSearch && matchesTag;
    });

    // ✅ Sort Logic (new options)
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();

      if (sortOrder === "newest") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      if (sortOrder === "az") return a.title.localeCompare(b.title);
      if (sortOrder === "za") return b.title.localeCompare(a.title);
      if (sortOrder === "tag")
        return (a.tag || "").localeCompare(b.tag || "");

      return 0;
    });

    return filtered;
  }, [notes, searchQuery, filterTag, sortOrder]);

  // ------------------ LOADING STATE ------------------
  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between border-b pb-5 mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Notes Overview
          </h1>
          <Button
            onClick={() => router.push("/notes/addnote")}
            className="gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            <Plus size={18} />
            Add New Note
          </Button>
        </div>
        <NotesSkeleton />
      </section>
    );
  }

  // ------------------ MAIN RETURN ------------------
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5 mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          Notes Overview
        </h1>
        <Button
          onClick={() => router.push("/notes/addnote")}
          className="gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          <Plus size={18} />
          Add New Note
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full md:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        {/* Filter + Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-44 h-11 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 shadow-sm hover:border-green-500 transition-all">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {uniqueTags.map((tag) => (
                  <SelectItem key={tag} value={tag.toLowerCase()}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort (functional now with 5 options) */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sort by:
            </p>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-32 h-11 rounded-xl dark:bg-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 shadow-sm hover:border-green-500 transition-all">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="az">Title (A–Z)</SelectItem>
                <SelectItem value="za">Title (Z–A)</SelectItem>
                <SelectItem value="tag">Tag</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {error ? (
        <p className="text-red-500 dark:text-red-400">
          Failed to load notes. Please try again.
        </p>
      ) : filteredNotes.length === 0 ? (
        <p className="italic text-gray-500 dark:text-gray-400 text-center mt-10">
          No notes found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NotesCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Notes;
