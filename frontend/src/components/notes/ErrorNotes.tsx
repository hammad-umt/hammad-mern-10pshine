"use client";

import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesErrorScreenProps {
  onRetry?: () => void;
  onBack?: () => void;
}

export const NotesErrorScreen: React.FC<NotesErrorScreenProps> = ({
  onRetry,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center relative">
      {/* Icon */}
      <div className="bg-gradient-to-r from-red-500/15 to-orange-500/15 p-6 rounded-full shadow-md">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      {/* Text */}
      <div className="mt-6 space-y-2 max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Couldn’t Load Your Notes 😕
        </h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Something went wrong while fetching your notes. Please check your
          internet connection or try again later.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRetry}
          className="gap-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all"
        >
          <RotateCcw size={18} />
          Retry
        </Button>

        <Button
          onClick={onBack}
          variant="outline"
          className="gap-2 rounded-xl border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ArrowLeft size={18} />
          Go Back
        </Button>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-gradient-to-t from-green-500/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};
