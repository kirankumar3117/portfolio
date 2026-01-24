import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

// 1. Define your base URL (CRITICAL for SEO images to work)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://softwareguru.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // 2. The Title Google sees
  title: {
    default: "Kiran Kumar | Senior Full-Stack Engineer",
    template: "%s | Kiran Kumar" // e.g., "Projects | Kiran Kumar"
  },

  // 3. The Description for Search Results
  description: "Portfolio of Kiran Kumar, a Lead Full-Stack Engineer specializing in scalable enterprise systems, Next.js, and Distributed Architecture. Based in India, available globally.",

  // 4. Keywords for ranking
  keywords: [
    "Kiran Kumar",
    "Software Guru",
    "Full Stack Engineer India",
    "Next.js Developer",
    "React Three Fiber Portfolio",
    "Enterprise System Architect",
    "Freelance Web Developer"
  ],

  // 5. Creator Info
  authors: [{ name: "Kiran Kumar", url: BASE_URL }],
  creator: "Kiran Kumar",

  // 6. How it looks on Facebook / LinkedIn / WhatsApp
  openGraph: {
    title: "Kiran Kumar | Software Guru",
    description: "Architecting scalable systems with React & Node.js.",
    url: BASE_URL,
    siteName: "SoftwareGuru.in",
    locale: "en_US",
    type: "website",
  },

  // 7. How it looks on Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Kiran Kumar | Senior Engineer",
    description: "Check out my interactive 3D portfolio.",
    creator: "@kirankumar", // Replace with your handle if you have one
  },

  // 8. Robot instructions (Tell Google: "Yes, scan this!")
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-black text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}