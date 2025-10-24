import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { ProtectedLayout } from "@/components/protectedRoute/protectedRoutes";

export default function ProtectedSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <NavbarWrapper />

      <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
        {children}
      </main>
    </ProtectedLayout>
  );
}
