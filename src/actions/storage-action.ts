"use server";

import { environment } from "@/configs/environment";
import { createClient } from "@/lib/supabase/server";

type StorageActionResult =
  | {
      status: "success";
      data: {
        url: string;
        path: string;
      };
    }
  | {
      status: "error";
      errors: {
        _form: string[];
      };
    };

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPublicStoragePath(bucket: string, url?: string | null) {
  if (!url) {
    return undefined;
  }

  const marker = `/storage/v1/object/public/${bucket}/`;
  const [, path] = url.split(marker);

  return path || undefined;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  previousPath?: string,
): Promise<StorageActionResult> {
  const supabase = await createClient({ isAdmin: true });
  const safeFileName = sanitizeFileName(file.name);
  const newPath = `${path}/${Date.now()}-${safeFileName}`;

  if (previousPath) {
    const { error } = await supabase.storage.from(bucket).remove([previousPath]);

    if (error) {
      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
      };
    }
  }

  const { error } = await supabase.storage.from(bucket).upload(newPath, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    data: {
      url: `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
      path: newPath,
    },
  };
}

export async function deleteFile(bucket: string, path?: string) {
  if (!path) {
    return {
      status: "success",
    };
  }

  const supabase = await createClient({ isAdmin: true });
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
