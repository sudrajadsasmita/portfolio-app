"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceFormState } from "@/types/experience";
import { experienceFormSchema } from "@/validations/experience-validation";

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getExperiencePayload(formData: FormData) {
  return experienceFormSchema.safeParse({
    year_label: formData.get("year_label"),
    title: formData.get("title"),
    description: formData.get("description"),
    stack: formData.get("stack"),
    highlights: formData.get("highlights"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "true",
  });
}

async function replaceExperienceChildren(
  experienceId: string,
  stacks: string[],
  highlights: string[],
) {
  const supabase = await createClient();

  const [{ error: stackDeleteError }, { error: highlightDeleteError }] =
    await Promise.all([
      supabase
        .from("portfolio_experience_stacks")
        .delete()
        .eq("experience_id", experienceId),
      supabase
        .from("portfolio_experience_highlights")
        .delete()
        .eq("experience_id", experienceId),
    ]);

  if (stackDeleteError || highlightDeleteError) {
    return stackDeleteError || highlightDeleteError;
  }

  if (stacks.length) {
    const { error } = await supabase.from("portfolio_experience_stacks").insert(
      stacks.map((name, index) => ({
        experience_id: experienceId,
        name,
        sort_order: index,
      })),
    );

    if (error) return error;
  }

  if (highlights.length) {
    const { error } = await supabase
      .from("portfolio_experience_highlights")
      .insert(
        highlights.map((highlight, index) => ({
          experience_id: experienceId,
          highlight,
          sort_order: index,
        })),
      );

    if (error) return error;
  }

  return null;
}

export default async function createExperience(
  prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  const validateFields = getExperiencePayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const experience = validateFields.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .insert({
      year_label: experience.year_label,
      title: experience.title,
      description: experience.description,
      sort_order: experience.sort_order,
      is_active: experience.is_active,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  const childError = await replaceExperienceChildren(
    data.id,
    toLines(experience.stack),
    toLines(experience.highlights),
  );

  if (childError) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [childError.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/experience");

  return { status: "success" };
}

export async function updateExperience(
  prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  const id = nullable(formData.get("id"));
  const validateFields = getExperiencePayload(formData);

  if (!id) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: ["Experience id is required"] },
    };
  }

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const experience = validateFields.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_experiences")
    .update({
      year_label: experience.year_label,
      title: experience.title,
      description: experience.description,
      sort_order: experience.sort_order,
      is_active: experience.is_active,
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  const childError = await replaceExperienceChildren(
    id,
    toLines(experience.stack),
    toLines(experience.highlights),
  );

  if (childError) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [childError.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/experience");

  return { status: "success" };
}

export async function deleteExperience(
  prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  const id = nullable(formData.get("id"));

  if (!id) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: ["Experience id is required"] },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_experiences")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/experience");

  return { status: "success" };
}
