import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/data/profile';
import './globals.css';

const spaceGrotesk = localFont({
  src: './fonts/space-grotesk.woff2',
  variable: '--font-portfolio-sans',
  weight: '400 700',
  display: 'swap',
});

const plexMono = localFont({
  src: './fonts/ibm-plex-mono.woff2',
  variable: '--font-portfolio-mono',
  weight: '500',
  display: 'swap',
});

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.description,
  alternates: { canonical: '/' },
  authors: [{ name: profile.name, url: profile.url }],
  openGraph: {
    title,
    description: profile.description,
    url: '/',
    siteName: profile.name,
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: profile.description,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: profile.url,
  jobTitle: profile.role,
  worksFor: { '@type': 'Organization', name: 'Blue Ray Automation' },
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
