import z from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^(https?:\/\/|\/).+/i.test(value), {
    message: "URL must start with http://, https://, or /",
  });

export const siteSettingsFormSchema = z.object({
  site_name: z.string().trim().min(1, "Site name is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  og_image_url: optionalUrl,
  twitter_card: z.string().trim().min(1, "Twitter card is required"),
  favicon_url: optionalUrl,
  contact_cta_title: z.string().trim(),
  contact_cta_description: z.string().trim(),
});

export const heroSnippetFormSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required"),
  code: z.string().trim().min(1, "Code snippet is required"),
});

export type SiteSettingsForm = z.input<typeof siteSettingsFormSchema>;
export type HeroSnippetForm = z.input<typeof heroSnippetFormSchema>;
