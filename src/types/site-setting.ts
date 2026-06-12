export type SiteSettingsFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    site_name?: string[];
    title?: string[];
    description?: string[];
    og_image_url?: string[];
    twitter_card?: string[];
    favicon_url?: string[];
    contact_cta_title?: string[];
    contact_cta_description?: string[];
    _form?: string[];
  };
};

export type HeroSnippetFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    filename?: string[];
    code?: string[];
    _form?: string[];
  };
};

export type PortfolioSiteSettingsRow = {
  id: string;
  site_name: string;
  title: string;
  description: string;
  og_image_url: string | null;
  twitter_card: string;
  favicon_url: string | null;
  contact_cta_title: string | null;
  contact_cta_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PortfolioHeroSnippetRow = {
  id: string;
  filename: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
