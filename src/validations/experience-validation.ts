import z from "zod";

export const experienceFormSchema = z.object({
  year_label: z.string().trim().min(1, "Year label is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  stack: z.string().trim(),
  highlights: z.string().trim(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export type ExperienceForm = z.input<typeof experienceFormSchema>;
