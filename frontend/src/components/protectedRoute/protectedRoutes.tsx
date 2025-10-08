// src/components/ui/protectedRoute/ProtectedLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // token is retrieved on the client only to avoid SSR errors (localStorage not defined on server)
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    // run only on client
    const t = (typeof window !== "undefined")
      ? (localStorage.getItem("token") || sessionStorage.getItem("token"))
      : null;

    setToken(t);

    if (!t) {
      router.replace("/auth/login"); // redirect to login if not logged in
    }
  }, [router]);

  // while we haven't checked storage yet, render nothing (or a loader)
  if (typeof token === "undefined") {
    return null;
  }

  // if token is null (not authenticated), the effect already redirected; render nothing
  if (!token) return null;

  return <>{children}</>;
}
