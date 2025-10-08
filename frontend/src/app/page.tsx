'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PenSquare, Cloud, Lock, Tag, CheckCircle2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white via-indigo-50/40 to-pink-50 text-gray-900">
      {/* Navbar */}
      <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="InkWell logo" width={36} height={36} className="rounded-md" />
            <span className="text-xl font-semibold">InkWell</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-gray-600 font-medium">
            <a href="features" className="hover:text-gray-900 transition">Features</a>
            <a href="about" className="hover:text-gray-900 transition">About</a>
            <a href="reviews" className="hover:text-gray-900 transition">Reviews</a>
            <Link href="/auth/login">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto w-full px-6 py-20 gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Capture your thoughts <br />
            with <span className="text-indigo-600">clarity & style</span> 🖋️
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            Write, organize, and sync your notes anywhere — beautifully designed to help you think clearly and stay productive.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <Link href="/auth/signup">
              <Button className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-medium gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="px-6 py-3 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="./illustration.svg" alt="Notes Illustration" width={480} height={380} className="drop-shadow-xl" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Powerful Features, Simple to Use</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard icon={<PenSquare className="h-8 w-8 text-indigo-600" />} title="Clean Editor" desc="Write seamlessly with a minimal and distraction-free text editor." />
            <FeatureCard icon={<Cloud className="h-8 w-8 text-indigo-600" />} title="Cloud Sync" desc="Access your notes anytime, anywhere, across all your devices." />
            <FeatureCard icon={<Lock className="h-8 w-8 text-indigo-600" />} title="Private & Secure" desc="Your data is encrypted and safely stored. You’re always in control." />
            <FeatureCard icon={<Tag className="h-8 w-8 text-indigo-600" />} title="Smart Organization" desc="Categorize and tag notes for effortless organization." />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Why InkWell?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            InkWell is crafted for writers, creators, and thinkers who value simplicity and focus.  
            Whether you’re journaling, planning, or drafting — InkWell keeps your creativity flowing.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">Loved by Writers Everywhere</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial name="Sara Khan" text="The clean UI and smooth syncing make InkWell my go-to for daily notes." />
            <Testimonial name="Ali Raza" text="Perfect for managing my writing projects — minimal yet powerful." />
            <Testimonial name="Ayesha Iqbal" text="Finally, a note app that feels personal and beautifully designed." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Start taking smarter notes today</h2>
          <p className="text-indigo-100 mb-8">
            Join thousands of users who organize their thoughts beautifully with InkWell.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold gap-2">
              Get Started Free <CheckCircle2 className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} InkWell. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-gray-800">Privacy Policy</a>
            <a href="#" className="hover:text-gray-800">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

// --- Reusable Components ---
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  )
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="p-6 bg-gray-50 border rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="italic text-gray-600 mb-4">“{text}”</p>
      <h4 className="font-medium text-gray-800">{name}</h4>
    </div>
  )
}
