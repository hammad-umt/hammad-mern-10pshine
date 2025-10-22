'use client';
import { SignupForm } from "@/components/signupform/SignupForm";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SignupPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // trigger animation on mount
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center 
                    bg-gray-50 dark:bg-gray-950 
                    transition-colors duration-300 p-4">
      <div
        className={`w-full max-w-md p-10 
                    bg-white dark:bg-gray-900 
                    rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800
                    transform transition-all duration-700 
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
      >
        {/* Logo */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="flex size-6 items-center justify-center rounded-md">
            <Image src="/logo.svg" alt="Logo" height={40} width={40} />
          </div>
          <span
            className="text-3xl font-bold text-gray-800 dark:text-gray-100"
            style={{ fontFamily: "var(--font-playfair-display)" }}
          >
            Ink<span className="text-indigo-600">Well</span>
          </span>
        </div>

        {/* Signup Form */}
        <SignupForm />

        {/* Footer */}
        <div className="text-center text-gray-400 dark:text-gray-500 mt-6 text-sm">
          © 2025 InkWell. All rights reserved.
        </div>
      </div>
    </div>
  );
}
