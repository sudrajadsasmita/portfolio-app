"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SkillFormState } from "@/types/skill";
import { skillFormSchema } from "@/validations/skill-validation";

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function getSkillPayload(formData: FormData) {
  return skillFormSchema.safeParse({
    category: formData.get("category"),
    name: formData.get("name"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "true",
  });
}

export default async function createSkill(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const validateFields = getSkillPayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const skill = validateFields.data;
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_skills").insert({
    category: skill.category,
    name: skill.name,
    description: nullable(skill.description),
    icon: nullable(skill.icon),
    sort_order: skill.sort_order,
    is_active: skill.is_active,
  });

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
  revalidatePath("/dashboard/skills");

  return { status: "success" };
}

export async function updateSkill(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const id = nullable(formData.get("id"));
  const validateFields = getSkillPayload(formData);

  if (!id) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Skill id is required"],
      },
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

  const skill = validateFields.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_skills")
    .update({
      category: skill.category,
      name: skill.name,
      description: nullable(skill.description),
      icon: nullable(skill.icon),
      sort_order: skill.sort_order,
      is_active: skill.is_active,
    })
    .eq("id", id);

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
  revalidatePath("/dashboard/skills");

  return { status: "success" };
}

export async function deleteSkill(
  prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const id = nullable(formData.get("id"));

  if (!id) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Skill id is required"],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_skills")
    .delete()
    .eq("id", id);

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
  revalidatePath("/dashboard/skills");

  return { status: "success" };
}
