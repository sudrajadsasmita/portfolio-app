import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/react-query-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SudrajadDS - Fullstack Developer",
  description:
    "Fullstack Developer specializing in Next.js, backend architecture, PostgreSQL, self-hosted infrastructure, and AI-powered applications.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sudraja DDS - Fullstack Developer",
    description:
      "Portfolio for a Fullstack Developer focused on Next.js, backend systems, PostgreSQL, AI apps, and self-hosted deployments.",
    url: siteUrl,
    siteName: "Sudraja DDS Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SudrajadDS - Fullstack Developer",
    description:
      "Next.js, backend architecture, PostgreSQL, AI applications, and self-hosted infrastructure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark scroll-smooth font-sans",
        geist.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-svh bg-[#020617] text-slate-100 antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
