import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from '@/components/CursorGlow';
import ScrollProgress from '@/components/ScrollProgress';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "OneX SpaceTechnologies Private — Exclusive Digital Community",
  description:
    "A multi-disciplinary private community spanning software, AI, cybersecurity, design, media, infrastructure, space research, and more. 300+ services. 19000+ members. Founded 2020.",
  keywords: [
    "OneX", "SpaceTechnologies", "private community", "tech community",
    "software development", "AI", "space research", "gaming", "design",
    "hosting infrastructure", "digital services",
  ],
  authors: [{ name: "OneX SpaceTechnologies" }],
  creator: "OneX SpaceTechnologies",
  publisher: "OneX SpaceTechnologies",
  openGraph: {
    title: "OneX SpaceTechnologies Private",
    description:
      "Beyond Boundaries. Beyond Limits. An exclusive private community spanning 24 disciplines with 300+ services.",
    type: "website",
    siteName: "OneX SpaceTechnologies",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneX SpaceTechnologies Private",
    description:
      "Beyond Boundaries. Beyond Limits. An exclusive private community.",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-space-dark text-white antialiased font-sans" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <div className="grain-overlay" />
        <CursorGlow />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
