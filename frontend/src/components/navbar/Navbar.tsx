"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LogoutDialog } from "./LogoutDialog";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const handleLogout = () => {
    setLogoutDialog(true);
  };
  const navLinks = [
    { name: "Notes", href: "/notes" },
    { name: "Profile", href: "/userDetails" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80  backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" height={30} width={30} />
          <h1
            className="text-xl font-bold text-gray-900  tracking-tight"
            style={{ fontFamily: "var(--font-playfair-display)" }}
          >
            Ink<span className="text-indigo-600">Well</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700  hover:text-indigo-600 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right - Logout */}
        <div className="hidden md:block">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-700 "
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden flex flex-col justify-center items-center border-t bg-white px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700  hover:text-indigo-600 transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </div>
      )}
      {/* Logout Confirmation Dialog */}
      <LogoutDialog open={logoutDialog} onOpenChange={setLogoutDialog} />
    </header>
  );
}
