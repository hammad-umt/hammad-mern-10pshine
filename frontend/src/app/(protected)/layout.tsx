import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { ProtectedLayout } from "@/components/protectedRoute/protectedRoutes";

export default function ProtectedSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      {/* Navbar visible only on protected routes */}
      <NavbarWrapper />

      {/* Page Content */}
      <main className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </main>
    </ProtectedLayout>
  );
}
