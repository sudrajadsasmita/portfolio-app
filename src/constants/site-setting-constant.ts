import type {
  HeroSnippetForm,
  SiteSettingsForm,
} from "@/validations/site-setting-validation";
import type {
  HeroSnippetFormState,
  SiteSettingsFormState,
} from "@/types/site-setting";

export const INITIAL_SITE_SETTINGS_FORM: SiteSettingsForm = {
  site_name: "SudrajadDS Portfolio",
  title: "SudrajadDS - Fullstack Developer",
  description:
    "Fullstack Developer specializing in Next.js, backend architecture, PostgreSQL, self-hosted infrastructure, and AI-powered applications.",
  og_image_url: "",
  twitter_card: "summary_large_image",
  favicon_url: "/favicon.ico",
  contact_cta_title: "Interested in working together?",
  contact_cta_description:
    "Let's build something useful, scalable, and production-ready.",
};

export const INITIAL_HERO_SNIPPET_FORM: HeroSnippetForm = {
  filename: "developer.ts",
  code: `const developer = {
  role: "Fullstack Developer",
  stack: ["Next.js", "NestJS", "Laravel", "PostgreSQL"],
  focus: "Backend Architecture + Modern UI",
  deployment: "Self-hosted Server",
};`,
};

export const INITIAL_STATE_SITE_SETTINGS_FORM: SiteSettingsFormState = {
  status: "idle",
  errors: {
    site_name: [],
    title: [],
    description: [],
    og_image_url: [],
    twitter_card: [],
    favicon_url: [],
    contact_cta_title: [],
    contact_cta_description: [],
    _form: [],
  },
};

export const INITIAL_STATE_HERO_SNIPPET_FORM: HeroSnippetFormState = {
  status: "idle",
  errors: {
    filename: [],
    code: [],
    _form: [],
  },
};
