import z from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^(https?:\/\/|\/).+/i.test(value), {
    message: "URL must start with http://, https://, or /",
  });

const optionalUploadedFile = z.union([
  optionalUrl,
  z.custom<File>(
    (value) =>
      typeof globalThis.File !== "undefined" && value instanceof globalThis.File,
  ),
]);

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Please enter a valid email address",
  });

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  title: z.string().trim().min(1, "Title is required"),
  headline: z.string().trim().min(1, "Headline is required"),
  bio: z.string().trim().min(1, "Bio is required"),
  avatar_url: optionalUploadedFile,
  resume_url: optionalUploadedFile,
  location: z.string().trim(),
  email: optionalEmail,
  phone: z.string().trim(),
  availability: z.string().trim(),
  github: optionalUrl,
  linkedin: optionalUrl,
  website: optionalUrl,
  instagram: optionalUrl,
  twitter: optionalUrl,
  facebook: optionalUrl,
  youtube: optionalUrl,
  gitlab: optionalUrl,
  medium: optionalUrl,
  devto: optionalUrl,
});

export type ProfileForm = z.infer<typeof profileFormSchema>;
