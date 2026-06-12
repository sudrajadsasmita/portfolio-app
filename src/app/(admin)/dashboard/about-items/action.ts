"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AboutItemFormState } from "@/types/about-item";
import { aboutItemFormSchema } from "@/validations/about-item-validation";

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function getAboutItemPayload(formData: FormData) {
  return aboutItemFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    sort_order: formData.get("sort_order"),
    is_active: formData.get("is_active") === "true",
  });
}

export default async function createAboutItem(
  prevState: AboutItemFormState,
  formData: FormData,
): Promise<AboutItemFormState> {
  const validateFields = getAboutItemPayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const item = validateFields.data;
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_about_items").insert({
    title: item.title,
    description: item.description,
    icon: nullable(item.icon),
    sort_order: item.sort_order,
    is_active: item.is_active,
  });

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/about-items");

  return { status: "success" };
}

export async function updateAboutItem(
  prevState: AboutItemFormState,
  formData: FormData,
): Promise<AboutItemFormState> {
  const id = nullable(formData.get("id"));
  const validateFields = getAboutItemPayload(formData);

  if (!id) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: ["About item id is required"] },
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

  const item = validateFields.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_about_items")
    .update({
      title: item.title,
      description: item.description,
      icon: nullable(item.icon),
      sort_order: item.sort_order,
      is_active: item.is_active,
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/about-items");

  return { status: "success" };
}

export async function deleteAboutItem(
  prevState: AboutItemFormState,
  formData: FormData,
): Promise<AboutItemFormState> {
  const id = nullable(formData.get("id"));

  if (!id) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: ["About item id is required"] },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_about_items")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: { ...prevState.errors, _form: [error.message] },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/about-items");

  return { status: "success" };
}
