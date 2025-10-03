"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return null; // or a loading spinner while redirecting
}
