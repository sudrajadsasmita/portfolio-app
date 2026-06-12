import z from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^(https?:\/\/|\/|#).+/i.test(value), {
    message: "URL must start with http://, https://, /, or #",
  });

const optionalUploadedFile = z.union([
  optionalUrl,
  z.custom<File>((value) => {
    const file = value as {
      size?: unknown;
      type?: unknown;
      name?: unknown;
      arrayBuffer?: unknown;
    };

    return (
      typeof value === "object" &&
      value !== null &&
      typeof file.size === "number" &&
      typeof file.type === "string" &&
      typeof file.name === "string" &&
      typeof file.arrayBuffer === "function"
    );
  }),
]);

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case slug"),
  description: z.string().trim().min(1, "Description is required"),
  image_url: optionalUploadedFile,
  image_alt: z.string().trim(),
  mockup_label: z.string().trim(),
  demo_url: optionalUrl,
  source_url: optionalUrl,
  case_study_url: optionalUrl,
  stack: z.string().trim(),
  highlights: z.string().trim(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export type ProjectForm = z.input<typeof projectFormSchema>;
