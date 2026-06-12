export type ProfileFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    name?: string[];
    title?: string[];
    headline?: string[];
    bio?: string[];
    avatar_url?: string[];
    resume_url?: string[];
    location?: string[];
    email?: string[];
    phone?: string[];
    availability?: string[];
    github?: string[];
    linkedin?: string[];
    website?: string[];
    instagram?: string[];
    twitter?: string[];
    facebook?: string[];
    youtube?: string[];
    gitlab?: string[];
    medium?: string[];
    devto?: string[];
    _form?: string[];
  };
};
