"use client"; 

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  return !isAuthRoute ? <Navbar /> : null;
}
