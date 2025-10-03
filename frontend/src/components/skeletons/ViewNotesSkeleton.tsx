"use client"
import React from "react"

export const ViewNoteSkeleton: React.FC = () => {
  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex-1 text-center">
          <div className="mx-auto h-10 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="mt-3 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="ml-4 flex gap-2">
          <div className="h-10 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-10 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      {/* Body Skeleton */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </section>
    </main>
  )
}
