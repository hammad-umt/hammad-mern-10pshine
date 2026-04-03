import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ---- Types ----
export interface Note {
  _id: string;
  user: string;
  title: string;
  description: string;
  tag: string;
  createdAt: string;
}

// ---- API Slice ----
export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`,
    prepareHeaders: (headers) => {
      // Attach JWT token if present
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Notes"], // helpful if you add cache invalidation later
  endpoints: (builder) => ({
    // Fetch all notes
    getNotes: builder.query<Note[], void>({
      query: () => ({
        url: "/fetchallnotes",
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),

    // Delete a single note by ID
    deleteNote: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/deletenote/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    editNote:builder.mutation<{ success: boolean; message: string }, { id: string, title: string, description: string, tag: string }>({
      query: ({ id, title, description, tag }) => ({
        url: `/updatenote/${id}`,
        method: "PUT",
        body: { title, description, tag },
      }),
      invalidatesTags: ["Notes"],
    }),
   addNote:builder.mutation<{ success: boolean; message: string }, { title: string, description: string, tag: string }>({
      query: ({ title, description, tag }) => ({
        url: `/addnote`,
        method: "POST",
        body: { title, description, tag },
      }),
      invalidatesTags: ["Notes"],
    }),
    fetchNoteById: builder.query<Note, string>({
      query: (id) => ({
        url: `/getNoteById/${id}`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
  }),
});

// ---- Hooks ----
export const { useGetNotesQuery, useDeleteNoteMutation, useEditNoteMutation, useAddNoteMutation, useFetchNoteByIdQuery } = notesApi;
