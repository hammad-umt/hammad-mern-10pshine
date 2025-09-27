// src/components/ui/protectedRoute/ProtectedLayout.tsx
"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoutes";


export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const loading = useProtectedRoute();

  if (loading) return <p>Loading...</p>; 
  return <>{children}</>;
}
