"use client";

import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
        min-h-screen 
        bg-gray-50 dark:bg-gray-950
        text-gray-900 dark:text-gray-100 
        transition-colors duration-300
        flex flex-col items-center justify-center
        px-4 sm:px-6 lg:px-8
      "
    >
      <div className="w-full max-w-5xl mx-auto">{children}</div>
    </main>
  );
}
