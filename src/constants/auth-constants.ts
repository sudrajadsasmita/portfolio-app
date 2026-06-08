import { Profile } from "@/types/auth";

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_PROFILE: Profile = {
  id: "",

  name: "",
  title: null,
  headline: null,
  bio: null,

  avatar_url: null,
  resume_url: null,

  location: null,
  email: null,
  phone: null,

  social_links: {
    github: null,
    linkedin: null,
    website: null,
    instagram: null,
    twitter: null,
    facebook: null,
    youtube: null,
    gitlab: null,
    medium: null,
    devto: null,
  },

  availability: null,

  created_at: "",
  updated_at: "",
  deleted_at: null,
};
