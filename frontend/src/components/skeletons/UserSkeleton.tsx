import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const UserDetailsSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-40 rounded-md" />
        <Button disabled variant="destructive" className="opacity-70">
          Logging out...
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-4">
        <Skeleton className="h-5 w-40 rounded-md" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-9 w-36 mt-4 rounded-md" />
      </div>

      {/* Personal Details */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-5">
        <Skeleton className="h-5 w-44 rounded-md" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 mt-2 rounded-md" />
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-5">
        <Skeleton className="h-5 w-44 rounded-md" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-9 w-40 mt-2 rounded-md" />
        </div>
      </div>
    </div>
  );
};
