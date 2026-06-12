"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  HeroSnippetFormState,
  SiteSettingsFormState,
} from "@/types/site-setting";
import {
  heroSnippetFormSchema,
  siteSettingsFormSchema,
} from "@/validations/site-setting-validation";

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function getSiteSettingsPayload(formData: FormData) {
  return siteSettingsFormSchema.safeParse({
    site_name: formData.get("site_name"),
    title: formData.get("title"),
    description: formData.get("description"),
    og_image_url: formData.get("og_image_url"),
    twitter_card: formData.get("twitter_card"),
    favicon_url: formData.get("favicon_url"),
    contact_cta_title: formData.get("contact_cta_title"),
    contact_cta_description: formData.get("contact_cta_description"),
  });
}

function getHeroSnippetPayload(formData: FormData) {
  return heroSnippetFormSchema.safeParse({
    filename: formData.get("filename"),
    code: formData.get("code"),
  });
}

export async function saveSiteSettings(
  prevState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  const validateFields = getSiteSettingsPayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const settings = validateFields.data;
  const id = nullable(formData.get("id"));
  const supabase = await createClient();
  const payload = {
    site_name: settings.site_name,
    title: settings.title,
    description: settings.description,
    og_image_url: nullable(settings.og_image_url),
    twitter_card: settings.twitter_card,
    favicon_url: nullable(settings.favicon_url),
    contact_cta_title: nullable(settings.contact_cta_title),
    contact_cta_description: nullable(settings.contact_cta_description),
    is_active: true,
  };

  const query = id
    ? supabase.from("portfolio_site_settings").update(payload).eq("id", id)
    : supabase.from("portfolio_site_settings").insert(payload);

  const { error } = await query;

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/site-settings");

  return { status: "success" };
}

export async function saveHeroSnippet(
  prevState: HeroSnippetFormState,
  formData: FormData,
): Promise<HeroSnippetFormState> {
  const validateFields = getHeroSnippetPayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const snippet = validateFields.data;
  const id = nullable(formData.get("id"));
  const supabase = await createClient();
  const payload = {
    filename: snippet.filename,
    code: snippet.code,
    is_active: true,
  };

  const query = id
    ? supabase.from("portfolio_hero_snippets").update(payload).eq("id", id)
    : supabase.from("portfolio_hero_snippets").insert(payload);

  const { error } = await query;

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/site-settings");

  return { status: "success" };
}
