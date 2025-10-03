"use client";
import React from "react";
import { Skeleton } from "../ui/skeleton";

export function NotesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4"
        >
          <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
          <Skeleton className="h-4 w-full rounded-md" /> {/* Line 1 */}
          <Skeleton className="h-4 w-5/6 rounded-md" /> {/* Line 2 */}
          <Skeleton className="h-4 w-4/6 rounded-md" /> {/* Line 3 */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-16 rounded-md" /> {/* Button 1 */}
            <Skeleton className="h-8 w-16 rounded-md" /> {/* Button 2 */}
          </div>
        </div>
      ))}
    </div>
  );
}
export default NotesSkeleton;