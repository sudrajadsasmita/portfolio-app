import z from "zod";

export const aboutItemFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  icon: z.string().trim(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
});

export type AboutItemForm = z.input<typeof aboutItemFormSchema>;
