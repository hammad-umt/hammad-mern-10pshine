# 🖋️ InkWell Frontend

A modern, responsive, and elegant **Next.js 14** frontend for the InkWell Notes App — built with **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **RTK Query** for state management.

---

## 🚀 Features

- **Authentication Flow**
  - Login, Signup, Forgot Password, Change Password
  - Protected Routes with session handling

- **Notes Management**
  - Create, Edit, Delete, and View notes
  - Tiptap Rich Text Editor for writing beautifully formatted notes
  - Markdown-safe rendering

- **UI & UX**
  - Modern, minimal, and responsive layout
  - Gradient-based landing page with illustrations
  - Reusable UI components with shadcn/ui

- **State Management & API Integration**
  - Redux Toolkit & RTK Query setup for clean API handling
  - Auto refetch and cache invalidation for notes
  - Centralized API base URL config

---

## 🧱 Folder Structure

```
src/
├── app/
│   ├── (auth)/                # Auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   ├── change-password/
│   │   └── forgot-password/
│   ├── (protected)/           # Protected user routes
│   │   ├── notes/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── edit/[id]/page.tsx
│   │   └── layout.tsx         # ProtectedLayout wrapper
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Public landing page
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # Reusable UI elements (buttons, dialogs, etc.)
│   ├── notes/                 # Note-related components
│   ├── auth/                  # Authentication components
│   └── protectedRoute/        # Protected route layout
│
├── hooks/
│   ├── useNotes.ts            # RTK Query hooks for notes
│   └── useAuth.ts             # RTK Query hooks for authentication
│
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── store.ts               # Redux store setup
│   └── api.ts                 # Base API slice
│
└── public/
    ├── logo.svg
    ├── landing-illustration.svg
    └── preview-notes.png
```

---

## ⚙️ Tech Stack

| Category | Stack |
|-----------|--------|
| Framework | **Next.js 14 (App Router)** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS**, **shadcn/ui**, **lucide-react** |
| State Management | **Redux Toolkit**, **RTK Query** |
| Forms | **React Hook Form**, **Zod Validation** |
| Editor | **Tiptap** |
| Icons | **Lucide Icons** |

---

## 🧩 Setup & Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/yourusername/inkwell-frontend.git
cd inkwell-frontend
```

### 2️⃣ Install dependencies

```bash
pnpm install
```

### 3️⃣ Create `.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 4️⃣ Run development server

```bash
pnpm dev
```

App runs on: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Protected Routes

All `/notes/*` routes are wrapped in `ProtectedLayout` — only accessible to authenticated users.

---

## 🧠 Testing

```bash
pnpm test
```

Uses **Jest** + **React Testing Library**.

---

## 📦 Build for Production

```bash
pnpm build
pnpm start
```

---

## 💅 Credits

Designed & developed by **Hammad Ur Rehman** ✨

---

### 📜 License

MIT © 2025 InkWell Notes
