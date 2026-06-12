import { cache } from "react";
import { environment } from "@/configs/environment";
import { experiences as fallbackExperiences } from "@/data/experience";
import { navItems, profile as fallbackProfile, terminalSnippet } from "@/data/profile";
import { projects as fallbackProjects } from "@/data/projects";
import { aboutItems as fallbackAboutItems, skillCategories } from "@/data/skills";
import { socials as fallbackSocials } from "@/data/socials";
import { createClient } from "@/lib/supabase/server";
import type {
  AboutItem,
  Experience,
  HeroSnippet,
  LandingContent,
  LandingProfile,
  LandingSiteSettings,
  Project,
  SkillCategory,
  Social,
} from "@/types";
import type { PortfolioAboutItemRow } from "@/types/about-item";
import type { PortfolioExperienceRow } from "@/types/experience";
import type { PortfolioProjectRow } from "@/types/project";
import type {
  PortfolioHeroSnippetRow,
  PortfolioSiteSettingsRow,
} from "@/types/site-setting";
import type { PortfolioSkillRow } from "@/types/skill";

type ProfileRow = {
  id: string;
  name: string;
  title: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  social_links: Record<string, string | null> | null;
  availability: string | null;
};

type PortfolioSocialLinkRow = {
  label: string;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
};

const defaultSiteSettings: LandingSiteSettings = {
  siteName: fallbackProfile.name,
  title: `${fallbackProfile.name} - ${fallbackProfile.role}`,
  description: fallbackProfile.description,
  ogImageUrl: null,
  twitterCard: "summary_large_image",
  faviconUrl: "/favicon.ico",
  contactCtaTitle: "Interested in working together?",
  contactCtaDescription:
    "Let's build something useful, scalable, and production-ready.",
};

const defaultHeroSnippet: HeroSnippet = {
  filename: "developer.ts",
  code: terminalSnippet,
};

function isSupabaseConfigured() {
  return Boolean(environment.SUPABASE_URL && environment.SUPABASE_ANON_KEY);
}

function fallbackContent(): LandingContent {
  return {
    profile: fallbackProfile,
    siteSettings: defaultSiteSettings,
    heroSnippet: defaultHeroSnippet,
    navItems,
    aboutItems: fallbackAboutItems,
    skillCategories,
    projects: fallbackProjects,
    experiences: fallbackExperiences,
    socials: fallbackSocials,
  };
}

function bySortOrder<T extends { sort_order: number }>(a: T, b: T) {
  return a.sort_order - b.sort_order;
}

function mapProfile(row: ProfileRow | null): LandingProfile {
  if (!row) {
    return fallbackProfile;
  }

  return {
    name: row.name || fallbackProfile.name,
    role: row.title || fallbackProfile.role,
    availability: row.availability || fallbackProfile.availability,
    headline: row.headline || fallbackProfile.headline,
    description: row.bio || fallbackProfile.description,
    email: row.email || fallbackProfile.email,
    siteUrl:
      row.social_links?.website ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      fallbackProfile.siteUrl,
    cvUrl: row.resume_url || fallbackProfile.cvUrl,
    location: row.location || fallbackProfile.location,
    avatarUrl: row.avatar_url,
  };
}

function mapSiteSettings(
  row: PortfolioSiteSettingsRow | null,
): LandingSiteSettings {
  if (!row) {
    return defaultSiteSettings;
  }

  return {
    siteName: row.site_name,
    title: row.title,
    description: row.description,
    ogImageUrl: row.og_image_url,
    twitterCard: row.twitter_card,
    faviconUrl: row.favicon_url,
    contactCtaTitle:
      row.contact_cta_title || defaultSiteSettings.contactCtaTitle,
    contactCtaDescription:
      row.contact_cta_description ||
      defaultSiteSettings.contactCtaDescription,
  };
}

function mapHeroSnippet(row: PortfolioHeroSnippetRow | null): HeroSnippet {
  if (!row) {
    return defaultHeroSnippet;
  }

  return {
    filename: row.filename,
    code: row.code,
  };
}

function mapAboutItems(rows: PortfolioAboutItemRow[] | null): AboutItem[] {
  if (!rows?.length) {
    return fallbackAboutItems;
  }

  return rows.sort(bySortOrder).map((item) => ({
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));
}

function getCategoryDefaults(category: string) {
  return skillCategories.find(
    (item) => item.title.toLowerCase() === category.toLowerCase(),
  );
}

function mapSkills(rows: PortfolioSkillRow[] | null): SkillCategory[] {
  if (!rows?.length) {
    return skillCategories;
  }

  const grouped = rows.sort(bySortOrder).reduce<Map<string, PortfolioSkillRow[]>>(
    (items, skill) => {
      const category = skill.category.trim();
      const group = items.get(category) ?? [];

      group.push(skill);
      items.set(category, group);

      return items;
    },
    new Map(),
  );

  return Array.from(grouped.entries()).map(([category, items]) => {
    const defaults = getCategoryDefaults(category);

    return {
      title: category,
      description:
        defaults?.description ||
        items.find((item) => item.description)?.description ||
        "Focused tools for production-ready fullstack applications.",
      items: items.map((item) => item.name),
      icon: items.find((item) => item.icon)?.icon || defaults?.icon || "Code2",
    };
  });
}

function mapProjects(rows: PortfolioProjectRow[] | null): Project[] {
  if (!rows?.length) {
    return fallbackProjects;
  }

  return rows.sort(bySortOrder).map((project) => ({
    title: project.title,
    description: project.description,
    mockup: project.mockup_label || "Production Application",
    imageUrl: project.image_url ?? undefined,
    imageAlt: project.image_alt ?? undefined,
    stack:
      project.portfolio_project_stacks
        ?.sort(bySortOrder)
        .map((item) => item.name) ?? [],
    highlights:
      project.portfolio_project_highlights
        ?.sort(bySortOrder)
        .map((item) => item.highlight) ?? [],
    links: {
      demo: project.demo_url || "#contact",
      source: project.source_url || "#github",
      caseStudy: project.case_study_url || "#contact",
    },
  }));
}

function mapExperiences(rows: PortfolioExperienceRow[] | null): Experience[] {
  if (!rows?.length) {
    return fallbackExperiences;
  }

  return rows.sort(bySortOrder).map((experience) => ({
    year: experience.year_label,
    title: experience.title,
    description: experience.description,
    stack:
      experience.portfolio_experience_stacks
        ?.sort(bySortOrder)
        .map((item) => item.name) ?? [],
    highlights:
      experience.portfolio_experience_highlights
        ?.sort(bySortOrder)
        .map((item) => item.highlight) ?? [],
  }));
}

function normalizeSocialIcon(icon: string | null, platform: string): Social["icon"] {
  const value = (icon || platform).toLowerCase();

  if (value.includes("github")) return "Github";
  if (value.includes("linkedin")) return "Linkedin";
  if (value.includes("whatsapp") || value.includes("message")) {
    return "MessageCircle";
  }

  return "Mail";
}

function mapSocials(
  rows: PortfolioSocialLinkRow[] | null,
  profile: LandingProfile,
  profileRow: ProfileRow | null,
): Social[] {
  if (rows?.length) {
    return rows.sort(bySortOrder).map((item) => ({
      label: item.label,
      href: item.url,
      icon: normalizeSocialIcon(item.icon, item.platform),
    }));
  }

  const socialsFromProfile = [
    profile.email && profile.email !== fallbackProfile.email
      ? {
          label: "Email",
          href: `mailto:${profile.email}`,
          icon: "Mail" as const,
        }
      : null,
    profileRow?.social_links?.github
      ? {
          label: "GitHub",
          href: profileRow.social_links.github,
          icon: "Github" as const,
        }
      : null,
    profileRow?.social_links?.linkedin
      ? {
          label: "LinkedIn",
          href: profileRow.social_links.linkedin,
          icon: "Linkedin" as const,
        }
      : null,
    profileRow?.phone
      ? {
          label: "WhatsApp",
          href: `https://wa.me/${profileRow.phone.replace(/\D/g, "")}`,
          icon: "MessageCircle" as const,
        }
      : null,
  ].filter((item): item is Social => Boolean(item));

  if (socialsFromProfile.length) {
    return socialsFromProfile;
  }

  if (profile.email !== fallbackProfile.email) {
    return [
      {
        label: "Email",
        href: `mailto:${profile.email}`,
        icon: "Mail",
      },
    ];
  }

  return fallbackSocials;
}

export const getLandingContent = cache(async (): Promise<LandingContent> => {
  if (!isSupabaseConfigured()) {
    return fallbackContent();
  }

  const supabase = await createClient();
  const [
    profileResult,
    settingsResult,
    snippetResult,
    aboutResult,
    skillsResult,
    projectsResult,
    experiencesResult,
    socialsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, name, title, headline, bio, avatar_url, resume_url, location, email, phone, social_links, availability",
      )
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_site_settings")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_hero_snippets")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("portfolio_about_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("portfolio_skills")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("portfolio_projects")
      .select(
        `
          *,
          portfolio_project_stacks(id, name, sort_order),
          portfolio_project_highlights(id, highlight, sort_order)
        `,
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("portfolio_experiences")
      .select(
        `
          *,
          portfolio_experience_stacks(id, name, sort_order),
          portfolio_experience_highlights(id, highlight, sort_order)
        `,
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("portfolio_social_links")
      .select("label, platform, url, icon, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const profile = mapProfile(
    profileResult.error ? null : (profileResult.data as ProfileRow | null),
  );
  const profileRow = profileResult.error
    ? null
    : (profileResult.data as ProfileRow | null);

  return {
    profile,
    siteSettings: mapSiteSettings(
      settingsResult.error
        ? null
        : (settingsResult.data as PortfolioSiteSettingsRow | null),
    ),
    heroSnippet: mapHeroSnippet(
      snippetResult.error
        ? null
        : (snippetResult.data as PortfolioHeroSnippetRow | null),
    ),
    navItems,
    aboutItems: mapAboutItems(
      aboutResult.error ? null : (aboutResult.data as PortfolioAboutItemRow[]),
    ),
    skillCategories: mapSkills(
      skillsResult.error ? null : (skillsResult.data as PortfolioSkillRow[]),
    ),
    projects: mapProjects(
      projectsResult.error ? null : (projectsResult.data as PortfolioProjectRow[]),
    ),
    experiences: mapExperiences(
      experiencesResult.error
        ? null
        : (experiencesResult.data as PortfolioExperienceRow[]),
    ),
    socials: mapSocials(
      socialsResult.error
        ? null
        : (socialsResult.data as PortfolioSocialLinkRow[]),
      profile,
      profileRow,
    ),
  };
});
