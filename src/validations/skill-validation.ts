import z from "zod";

export const skillFormSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
  icon: z.string().trim(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export type SkillForm = z.input<typeof skillFormSchema>;
