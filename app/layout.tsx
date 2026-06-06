import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CursorGlow from "@/components/CursorGlow";
import dynamic from "next/dynamic";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omm-ai.vercel.app"),
  title: "Omm Prakash Sahoo | AI & Web Developer | OMM//AI",
  description: "AI & Web Developer building intelligent systems, modern web applications, and immersive digital experiences. Explore OMM//AI projects and innovations.",
  keywords: [
    "Omm Prakash Sahoo", "OMM AI", "AI Developer", "Web Developer", 
    "Full Stack Developer", "Next.js Developer", "React Developer", 
    "AI Engineer", "Portfolio Website", "3D Portfolio", "Artificial Intelligence Developer"
  ],
  authors: [{ name: "Omm Prakash Sahoo", url: "https://omm-ai.vercel.app" }],
  creator: "Omm Prakash Sahoo",
  openGraph: {
    type: "website",
    url: "https://omm-ai.vercel.app",
    title: "Omm Prakash Sahoo | AI & Web Developer | OMM//AI",
    description: "AI & Web Developer building intelligent systems, modern web applications, and immersive digital experiences. Explore OMM//AI projects and innovations.",
    siteName: "OMM//AI",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "OMM//AI Portfolio Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Omm Prakash Sahoo | AI & Web Developer | OMM//AI",
    description: "AI & Web Developer building intelligent systems, modern web applications, and immersive digital experiences. Explore OMM//AI projects and innovations.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Omm Prakash Sahoo",
  "url": "https://omm-ai.vercel.app",
  "jobTitle": "AI & Web Developer",
  "email": "ommprakashs648@gmail.com",
  "sameAs": [
    "https://github.com/oomm-prakshhh",
    "https://www.linkedin.com/in/omm-prakash-sahoo-a4a0173a4/"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Odisha",
    "addressCountry": "India"
  }
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200 relative">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[10000] focus:p-4 focus:bg-cyan-950 focus:text-cyan-400 focus:font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-br-lg transition-colors">
          Skip to main content
        </a>
        <CursorGlow />
        <AIAssistant />
        <Header />
        <main id="main-content" className="flex-1 flex flex-col items-center w-full">
          {children}
        </main>

      </body>
    </html>
  );
}
