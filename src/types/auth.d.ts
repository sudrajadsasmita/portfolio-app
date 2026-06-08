export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export type SocialLinks = {
  github: string | null;
  linkedin: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  facebook: string | null;
  youtube: string | null;
  gitlab: string | null;
  medium: string | null;
  devto: string | null;
};

export type Profile = {
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

  social_links: SocialLinks | null;

  availability: string | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
