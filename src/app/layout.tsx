import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import dynamic from "next/dynamic";
const SceneWrapper = dynamic(() => import("@/components/canvas/SceneWrapper"), { ssr: false });
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Vasudha | Talent & Strategy Market",
  description: "Next-gen autonomous freelance ecosystem for global freelancers and strategic organizations.",
  keywords: [
    "freelance",
    "market",
    "global talent",
    "strategy", 
    "autonomous matching", 
    "secure contracts", 
    "Vasudha"
  ],
  authors: [{ name: "Vasudha Protocol" }],
  openGraph: {
    title: "Vasudha | Talent & Strategy Market",
    description: "Next-gen autonomous freelance ecosystem for global freelancers.",
    url: "https://vasudha.network",
    siteName: "Vasudha Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vasudha Command Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasudha | Talent & Strategy Market",
    description: "Next-gen autonomous freelance ecosystem for global freelancers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/brand-icon.png",
    shortcut: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-[#030305] overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="noise-overlay" />

        {/* Persistent Background Layer */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <SceneWrapper />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-30" />
        </div>

        <Navigation />
        <main className="relative z-10 flex flex-col min-h-screen">
          {children}
        </main>

        {/* Global Toast Notifications */}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            className: 'bg-black/80 border border-white/10 text-white backdrop-blur-xl font-inter',
          }} 
        />
      </body>
    </html>
  );
}
