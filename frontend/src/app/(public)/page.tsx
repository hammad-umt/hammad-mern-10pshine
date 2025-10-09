import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-100 px-6 text-center">
      <div className="max-w-3xl">
        {/* Brand / Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-primary">InkWell</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg md:text-xl mb-10">
          Capture your ideas, organize your thoughts, and stay productive — all in one elegant space.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="px-8 py-6 text-base font-medium">
              Get Started
            </Button>
          </Link>

          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium">
              Login
            </Button>
          </Link>
        </div>

        {/* Optional tagline */}
        <p className="mt-16 text-sm text-gray-500">
          Built with ❤️ using Next.js + Shadcn UI
        </p>
      </div>
    </section>
  );
}
