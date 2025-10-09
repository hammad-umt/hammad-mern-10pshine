"use client";
import { AlertTriangle, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



export const UserErrorScreen = () => {
  const router = useRouter();
  const onGoBack = () => {
    router.back();
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Icon */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-full shadow-md">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      {/* Text */}
      <div className="mt-6 space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Oops! Something went wrong 😕
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          We couldn’t fetch your profile details right now. Please check your internet connection or try again in a moment.
        </p>
      </div>

      {/* Retry Button */}
      <div className="mt-8">
        <Button
          onClick={onGoBack}
          className="gap-2 rounded-xl bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-colors"
        >
          <ArrowLeftIcon size={18} />
          Go Back
        </Button>
      </div>

      {/* Decorative Gradient Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-t from-green-500/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};
