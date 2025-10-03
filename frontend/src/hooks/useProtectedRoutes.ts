"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "sonner";

export const useProtectedRoute = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Agar user login ya register route par hai → allow
    if (pathname.startsWith("/auth")) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expiry = decoded.exp ? decoded.exp * 1000 : 0;

      if (!expiry || expiry < Date.now()) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        router.replace("/auth/login");
      }
    } catch (err) {
      console.error("JWT Decode Error:", err);
      localStorage.removeItem("token");
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  return loading;
};
