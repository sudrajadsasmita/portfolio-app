import type { NavItem } from "@/types";

export const profile = {
  name: "SudrajadDS",
  role: "Fullstack Developer",
  availability: "Available for fullstack and backend roles",
  headline: "Fullstack Developer specializing in Next.js & Backend Systems",
  description:
    "I build modern web applications with scalable backend APIs, PostgreSQL, AI-powered workflows, and self-hosted infrastructure that is ready for production.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "your-email@example.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  cvUrl: "/cv.pdf",
  location: "Indonesia",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const terminalSnippet = `const developer = {
  role: "Fullstack Developer",
  stack: ["Next.js", "NestJS", "Laravel", "PostgreSQL"],
  focus: "Backend Architecture + Modern UI",
  deployment: "Self-hosted Server",
};`;
