"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <main
      className="
        relative
        min-h-screen 
        bg-gray-50 dark:bg-gray-950
        text-gray-900 dark:text-gray-100 
        transition-colors duration-300
        flex flex-col items-center justify-center
        px-4 sm:px-6 lg:px-8
      "
    >
      {/* Go Back Button - top left */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="text-gray-700 dark:text-gray-200" size={18} />
        </Button>
      </div>

      {/* Theme Toggle Button - top right */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="text-yellow-400" size={18} />
          ) : (
            <Moon size={18} />
          )}
        </Button>
      </div>

      {/* Page Content */}
      <div className="w-full max-w-5xl mx-auto">{children}</div>
    </main>
  );
}
