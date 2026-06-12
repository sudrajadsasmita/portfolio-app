"use server";

import { revalidatePath } from "next/cache";
import { getPublicStoragePath, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import type { ProfileFormState } from "@/types/profile";
import { profileFormSchema } from "@/validations/profile-validation";

const PROFILE_STORAGE_BUCKET = "portfolio";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function nullable(value?: unknown) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length ? trimmed : null;
}

function getProfilePayload(formData: FormData) {
  return profileFormSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    avatar_url: formData.get("avatar_url"),
    resume_url: formData.get("resume_url"),
    location: formData.get("location"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    availability: formData.get("availability"),
    github: formData.get("github"),
    linkedin: formData.get("linkedin"),
    website: formData.get("website"),
    instagram: formData.get("instagram"),
    twitter: formData.get("twitter"),
    facebook: formData.get("facebook"),
    youtube: formData.get("youtube"),
    gitlab: formData.get("gitlab"),
    medium: formData.get("medium"),
    devto: formData.get("devto"),
  });
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

async function uploadProfileAsset({
  bucketPath,
  file,
  previousUrl,
  allowedTypes,
  maxSize,
  label,
}: {
  bucketPath: string;
  file: File;
  previousUrl?: string | null;
  allowedTypes: string[];
  maxSize: number;
  label: string;
}) {
  if (!allowedTypes.includes(file.type)) {
    return {
      status: "error" as const,
      errors: {
        _form: [`${label} file type is not allowed`],
      },
    };
  }

  if (file.size > maxSize) {
    return {
      status: "error" as const,
      errors: {
        _form: [`${label} file is too large`],
      },
    };
  }

  return uploadFile(
    PROFILE_STORAGE_BUCKET,
    bucketPath,
    file,
    await getPublicStoragePath(PROFILE_STORAGE_BUCKET, previousUrl),
  );
}

export async function saveProfile(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const validateFields = getProfilePayload(formData);

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const profile = validateFields.data;
  const supabase = await createClient();
  const id = nullable(formData.get("id"));
  let avatarUrl = nullable(profile.avatar_url);
  let resumeUrl = nullable(profile.resume_url);

  if (isUploadedFile(profile.avatar_url)) {
    const uploadAvatar = await uploadProfileAsset({
      bucketPath: "avatars",
      file: profile.avatar_url,
      previousUrl: formData.get("old_avatar_url") as string | null,
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      maxSize: MAX_AVATAR_SIZE,
      label: "Avatar",
    });

    if (uploadAvatar.status === "error") {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: uploadAvatar.errors._form,
        },
      };
    }

    avatarUrl = uploadAvatar.data.url;
  }

  if (isUploadedFile(profile.resume_url)) {
    const uploadResume = await uploadProfileAsset({
      bucketPath: "resumes",
      file: profile.resume_url,
      previousUrl: formData.get("old_resume_url") as string | null,
      allowedTypes: ["application/pdf"],
      maxSize: MAX_RESUME_SIZE,
      label: "Resume",
    });

    if (uploadResume.status === "error") {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: uploadResume.errors._form,
        },
      };
    }

    resumeUrl = uploadResume.data.url;
  }

  const payload = {
    name: profile.name,
    title: profile.title,
    headline: profile.headline,
    bio: profile.bio,
    avatar_url: avatarUrl,
    resume_url: resumeUrl,
    location: nullable(profile.location),
    email: nullable(profile.email),
    phone: nullable(profile.phone),
    availability: nullable(profile.availability),
    social_links: {
      github: nullable(profile.github),
      linkedin: nullable(profile.linkedin),
      website: nullable(profile.website),
      instagram: nullable(profile.instagram),
      twitter: nullable(profile.twitter),
      facebook: nullable(profile.facebook),
      youtube: nullable(profile.youtube),
      gitlab: nullable(profile.gitlab),
      medium: nullable(profile.medium),
      devto: nullable(profile.devto),
    },
    deleted_at: null,
  };

  const query = id
    ? supabase.from("profiles").update(payload).eq("id", id)
    : supabase.from("profiles").insert(payload);

  const { error } = await query;

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
  revalidatePath("/dashboard/profile");

  return {
    status: "success",
  };
}

export async function deleteProfile(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const id = nullable(formData.get("id") as string | null);

  if (!id) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Profile id is required"],
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ deleted_at: new Date().toISOString() })
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
  revalidatePath("/dashboard/profile");

  return {
    status: "success",
  };
}
