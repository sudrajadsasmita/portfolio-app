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
  icon?: string | null;
};

export type SkillCategory = {
  title: string;
  description: string;
  items: string[];
  icon?: string | null;
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

export type LandingProfile = {
  name: string;
  role: string;
  availability: string;
  headline: string;
  description: string;
  email: string;
  siteUrl: string;
  cvUrl: string;
  location: string;
  avatarUrl?: string | null;
};

export type LandingSiteSettings = {
  siteName: string;
  title: string;
  description: string;
  ogImageUrl?: string | null;
  twitterCard: "summary" | "summary_large_image" | string;
  faviconUrl?: string | null;
  contactCtaTitle: string;
  contactCtaDescription: string;
};

export type HeroSnippet = {
  filename: string;
  code: string;
};

export type LandingContent = {
  profile: LandingProfile;
  siteSettings: LandingSiteSettings;
  heroSnippet: HeroSnippet;
  navItems: NavItem[];
  aboutItems: AboutItem[];
  skillCategories: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  socials: Social[];
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
