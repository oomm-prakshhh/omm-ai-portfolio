import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern Portfolio",
  description: "A showcase of my creative work and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
        <Header />
        <main className="flex-1 flex flex-col items-center w-full">
          {children}
        </main>
        <footer className="w-full border-t border-white/10 py-6 text-center text-sm text-zinc-500 mt-auto">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
