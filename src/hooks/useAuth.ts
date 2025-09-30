import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  authToken: string;
}

interface User {
  id: number;
  email: string;
  username: string;
}
interface SignUpResponse {
  authToken: string;
}
interface ChangePasswordRes {
  message: string,
}
export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.100.12:5000/api/users",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: "/getUser",
        method: "GET",
      }),
    }),
    singUp: builder.mutation<SignUpResponse, ({ email: string, password: string, name: string })>({
      query: ({ email, password, name }) => ({
        url: "/signup",
        method: "POST",
        body: { email, name, password }
      })
    }),
    changePassword: builder.mutation<ChangePasswordRes, ({ oldPassword: string, newPassword: string })>({
      query: ({ oldPassword, newPassword }) => ({
        url: '/changePassword',
        method: 'PUT',
        body: { oldPassword, newPassword }
      })
    }),
    updateUser: builder.mutation<{ message: string }, { name?: string | null; email?: string | null }>({
      query: ({ name, email }) => {
        const body: Record<string, string> = {}
        if (name !== null && name !== undefined) body.name = name
        if (email !== null && email !== undefined) body.email = email

        return {
          url: "/updateDetails",
          method: "PUT",
          body,
        }
      },
    }),
  }),
});

// Hooks for usage
export const { useLoginMutation, useGetUserQuery, useSingUpMutation, useChangePasswordMutation,useUpdateUserMutation } = authApi;
