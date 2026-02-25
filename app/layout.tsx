import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

// 1. Define your base URL (CRITICAL for SEO images to work)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://softwareguru.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // 2. The Title Google sees
  title: {
    default: "Kiran Kumar | Software Guru | Senior Full-Stack Engineer",
    template: "%s | Kiran Kumar - Software Guru" // e.g., "Projects | Kiran Kumar"
  },

  // 3. The Description for Search Results
  description: "Portfolio of Kiran Kumar, a Lead Full-Stack Engineer based in India specializing in scalable enterprise systems, React, Next.js, FastAPI, and Distributed Architecture. Known online as Software Guru.",

  // 4. Keywords for ranking (Aggressively expanded for intent)
  keywords: [
    "Kiran Kumar",
    "softwareguru",
    "Software Guru",
    "softwareguru.in",
    "Kiran Kumar portfolio",
    "software india",
    "software engineer india",
    "full stack engineer india",
    "top react developer india",
    "Next.js Developer India",
    "freelance web developer bangalore",
    "freelance software developer india",
    "React Three Fiber Portfolio",
    "Enterprise System Architect",
    "Python developer India",
    "FastAPI backend engineer",
    "Kiran Kumar Software Engineer"
  ],

  // 5. Canonical URL to prevent duplicate content penalties
  alternates: {
    canonical: BASE_URL,
  },

  // 6. Creator Info
  authors: [{ name: "Kiran Kumar", url: BASE_URL }],
  creator: "Kiran Kumar",

  // 7. How it looks on Facebook / LinkedIn / WhatsApp
  openGraph: {
    title: "Kiran Kumar | Software Guru | Engineer",
    description: "Senior Full-Stack Engineer architecting scalable systems from India. Specializing in Next.js, React, and Python.",
    url: BASE_URL,
    siteName: "SoftwareGuru.in",
    locale: "en_IN", // Localized to India
    type: "profile",
  },

  // 8. How it looks on Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Kiran Kumar | Software Guru",
    description: "Check out my interactive 3D engineering portfolio.",
    creator: "@kirankumar", // Replace with your handle if you have one
  },

  // 9. Robot instructions (Tell Google: "Yes, scan this!")
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
  // Define JSON-LD Schema for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kiran Kumar",
    "alternateName": "Software Guru",
    "url": BASE_URL,
    "jobTitle": "Senior Full-Stack Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "SoftwareGuru.in"
    },
    "nationality": "Indian",
    "description": "Senior Full-Stack Engineer based in India, specializing in React, Next.js, and high-performance backend systems.",
    "sameAs": [
      "https://github.com/kirankumar3117",
      "https://www.linkedin.com/in/kiran-kumar-17382ba1" // Ensure this is correct
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-black text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}