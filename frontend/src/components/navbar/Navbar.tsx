"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { LogoutDialog } from "./LogoutDialog";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleLogout = () => setLogoutDialog(true);

  const navLinks = [
    { name: "Notes", href: "/notes" },
    { name: "Profile", href: "/userDetails" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" height={32} width={32} />
          <h1
            className="text-xl font-bold text-gray-900 dark:text-white tracking-tight"
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
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-transform hover:scale-110"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded-full px-5 font-medium transition-transform duration-200 hover:scale-105"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Right - Theme + Menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm transition-transform hover:scale-110"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            className="p-2 text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center border-t bg-white dark:bg-gray-900 px-6 py-4 space-y-4 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full rounded-full font-medium"
          >
            Logout
          </Button>
        </div>
      )}

      {/* Logout Dialog */}
      <LogoutDialog open={logoutDialog} onOpenChange={setLogoutDialog} />
    </header>
  );
}
