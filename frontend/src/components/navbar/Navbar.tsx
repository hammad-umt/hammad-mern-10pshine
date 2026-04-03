"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { LogoutDialog } from "./LogoutDialog";
import { useTheme } from "next-themes";
import { useGetUserQuery } from "@/hooks/useAuth";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const { data } = useGetUserQuery();

  const handleLogout = () => setLogoutDialog(true);

  const navLinks = [
    { name: "Notes", href: "/notes" },
    { name: "Profile", href: "/userDetails" },
  ];

  const getInitial = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link href="/notes" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Logo"
            height={32}
            width={32}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          <h1
            className="text-xl font-bold text-gray-900 dark:text-white tracking-tight"
            style={{ fontFamily: "var(--font-playfair-display)" }}
          >
            Ink<span className="text-indigo-600">Well</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
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

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110 transition-transform"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-400 w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* User Avatar */}
          {data && (
            <button
              onClick={() => (window.location.href = "/userDetails")}
              className="relative group"
            >
              {data?.image ? (
                <img
                  src={data.image}
                  alt="User Profile"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500 shadow-sm group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="h-9 w-9 flex items-center justify-center rounded-full border-2 border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg font-serif font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {getInitial(data?.name)}
                </div>
              )}
            </button>
          )}

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5 font-medium shadow-sm transition-transform hover:scale-105"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Right - Theme + Menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110 transition-transform"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
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
        <div className="md:hidden flex flex-col items-center border-t bg-white dark:bg-gray-900 px-6 py-4 space-y-4 shadow-md animate-in slide-in-from-top-5">
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

          {data && (
            <button
              onClick={() => {
                setMenuOpen(false);
                window.location.href = "/userDetails";
              }}
              className="flex items-center gap-2"
            >
              {data?.image ? (
                <img
                  src={data.image}
                  alt="User Profile"
                  width={30}
                  height={30}
                  className="rounded-full object-cover border border-indigo-400"
                />
              ) : (
                <div className="h-8 w-8 flex items-center justify-center rounded-full border border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-serif font-bold">
                  {getInitial(data?.name)}
                </div>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {data?.name || "Profile"}
              </span>
            </button>
          )}

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
