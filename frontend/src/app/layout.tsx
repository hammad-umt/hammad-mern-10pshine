import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "./provider/provider";
import AOSProvider from "@/components/AOSProvider";
import { ThemeProvider } from "next-themes"; // ✅ Added import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const playFairDispaly = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkWell - Your Personal Note-Taking App",
  description: "Inkwell is a note-taking app that helps you organize your thoughts and ideas.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playFairDispaly.variable} antialiased transition-colors duration-300 bg-white text-black dark:bg-gray-950 dark:text-white`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <AOSProvider>{children}</AOSProvider>
          </ThemeProvider>
        </ReduxProvider>

        <Toaster
          closeButton={true}
          richColors={true}
          position="bottom-right"
          theme="light"
        />
      </body>
    </html>
  );
}
