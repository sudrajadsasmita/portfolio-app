import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type Social = {
  label: string;
  href: string;
  icon: "Github" | "Linkedin" | "Mail" | "MessageCircle";
};

export type AboutItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SkillCategory = {
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
};

export type Project = {
  title: string;
  description: string;
  mockup: string;
  imageUrl?: string;
  imageAlt?: string;
  stack: string[];
  highlights: string[];
  links: {
    demo: string;
    source: string;
    caseStudy: string;
  };
};

export type Experience = {
  year: string;
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
};

export type Repository = {
  name: string;
  description: string;
  stack: string[];
  stars: number;
  forks: number;
  href: string;
};

export type ProjectQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isFeatured?: boolean;
  published?: boolean;
  stack?: string;
};
