"use server";

import { revalidatePath } from "next/cache";
import { deleteFile, getPublicStoragePath, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import type { ProjectFormState } from "@/types/project";
import { projectFormSchema } from "@/validations/project-validation";

const PROJECT_STORAGE_BUCKET = "portfolio";
const MAX_PROJECT_IMAGE_SIZE = 3 * 1024 * 1024;

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isUploadedFile(value: unknown): value is File {
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
    typeof file.arrayBuffer === "function" &&
    file.size > 0
  );
}

function getProjectPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "");

  return projectFormSchema.safeParse({
    title,
    slug: slugify(title),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    image_alt: formData.get("image_alt"),
    mockup_label: formData.get("mockup_label"),
    demo_url: formData.get("demo_url"),
    source_url: formData.get("source_url"),
    case_study_url: formData.get("case_study_url"),
    stack: formData.get("stack"),
    highlights: formData.get("highlights"),
    is_featured: formData.get("is_featured") === "true",
    is_published: formData.get("is_published") === "true",
    sort_order: formData.get("sort_order"),
  });
}

async function uploadProjectImage(
  image: File,
  previousUrl?: string | null,
): Promise<
  | { status: "success"; url: string }
  | { status: "error"; errors: { _form: string[] } }
> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(image.type)) {
    return {
      status: "error",
      errors: { _form: ["Project image file type is not allowed"] },
    };
  }

  if (image.size > MAX_PROJECT_IMAGE_SIZE) {
    return {
      status: "error",
      errors: { _form: ["Project image file is too large"] },
    };
  }

  const upload = await uploadFile(
    PROJECT_STORAGE_BUCKET,
    "projects",
    image,
    await getPublicStoragePath(PROJECT_STORAGE_BUCKET, previousUrl),
  );

  if (upload.status === "error") {
    return upload;
  }

  return {
    status: "success",
    url: upload.data.url,
  };
}

async function replaceProjectChildren(
  projectId: string,
  stacks: string[],
  highlights: string[],
) {
  const supabase = await createClient();

  const [{ error: stackDeleteError }, { error: highlightDeleteError }] =
    await Promise.all([
      supabase.from("portfolio_project_stacks").delete().eq("project_id", projectId),
      supabase
        .from("portfolio_project_highlights")
        .delete()
        .eq("project_id", projectId),
    ]);

  if (stackDeleteError || highlightDeleteError) {
    return stackDeleteError || highlightDeleteError;
  }

  if (stacks.length) {
    const { error } = await supabase.from("portfolio_project_stacks").insert(
      stacks.map((name, index) => ({
        project_id: projectId,
        name,
        sort_order: index,
      })),
    );

    if (error) {
      return error;
    }
  }

  if (highlights.length) {
    const { error } = await supabase.from("portfolio_project_highlights").insert(
      highlights.map((highlight, index) => ({
        project_id: projectId,
        highlight,
        sort_order: index,
      })),
    );

    if (error) {
      return error;
    }
  }

  return null;
}

export default async function createProject(
  prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const validateFields = getProjectPayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const project = validateFields.data;
  let imageUrl = nullable(project.image_url);

  if (isUploadedFile(project.image_url)) {
    const upload = await uploadProjectImage(project.image_url);

    if (upload.status === "error") {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: upload.errors._form,
        },
      };
    }

    imageUrl = upload.url;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .insert({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image_url: imageUrl,
      image_alt: nullable(project.image_alt),
      mockup_label: nullable(project.mockup_label),
      demo_url: nullable(project.demo_url),
      source_url: nullable(project.source_url),
      case_study_url: nullable(project.case_study_url),
      is_featured: project.is_featured,
      is_published: project.is_published,
      sort_order: project.sort_order,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const childError = await replaceProjectChildren(
    data.id,
    toLines(project.stack),
    toLines(project.highlights),
  );

  if (childError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [childError.message],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/projects");

  return { status: "success" };
}

export async function updateProject(
  prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const validateFields = getProjectPayload(formData);
  const id = nullable(formData.get("id"));

  if (!id) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Project id is required"],
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

  const project = validateFields.data;
  let imageUrl = nullable(project.image_url);

  if (isUploadedFile(project.image_url)) {
    const upload = await uploadProjectImage(
      project.image_url,
      formData.get("old_image_url") as string | null,
    );

    if (upload.status === "error") {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: upload.errors._form,
        },
      };
    }

    imageUrl = upload.url;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_projects")
    .update({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image_url: imageUrl,
      image_alt: nullable(project.image_alt),
      mockup_label: nullable(project.mockup_label),
      demo_url: nullable(project.demo_url),
      source_url: nullable(project.source_url),
      case_study_url: nullable(project.case_study_url),
      is_featured: project.is_featured,
      is_published: project.is_published,
      sort_order: project.sort_order,
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

  const childError = await replaceProjectChildren(
    id,
    toLines(project.stack),
    toLines(project.highlights),
  );

  if (childError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [childError.message],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/projects");

  return { status: "success" };
}

export async function deleteProject(
  prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const id = nullable(formData.get("id"));
  const imageUrl = nullable(formData.get("image_url"));

  if (!id) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Project id is required"],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  await deleteFile(
    PROJECT_STORAGE_BUCKET,
    await getPublicStoragePath(PROJECT_STORAGE_BUCKET, imageUrl),
  );

  revalidatePath("/");
  revalidatePath("/dashboard/projects");

  return { status: "success" };
}
