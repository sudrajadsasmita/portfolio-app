"use client";

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { File as FileIcon, FileImage, Upload } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

function isFileValue(value: unknown): value is globalThis.File {
  return (
    typeof globalThis.File !== "undefined" && value instanceof globalThis.File
  );
}

type FormFileProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  accept: string;
  currentUrl?: string | null;
  previewUrl?: string;
  description?: string;
  variant?: "image" | "document";
  onFileChange?: (file?: globalThis.File, displayUrl?: string) => void;
};

export default function FormFile<T extends FieldValues>({
  form,
  name,
  label,
  accept,
  currentUrl,
  previewUrl,
  description,
  variant = "document",
  onFileChange,
}: FormFileProps<T>) {
  const isImage = variant === "image";
  const PreviewIcon = isImage ? FileImage : FileIcon;

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...rest }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-3 sm:flex-row sm:items-center">
            <div
              className={cn(
                "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-muted-foreground",
                isImage && "bg-slate-950",
              )}
            >
              {isImage && previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={`${label} preview`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PreviewIcon className="size-6" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                {...rest}
                id={name}
                type="file"
                accept={accept}
                aria-invalid={fieldState.invalid}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  onChange(file ?? "");
                  onFileChange?.(
                    file,
                    file && isImage ? URL.createObjectURL(file) : undefined,
                  );
                }}
              />
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Upload className="size-3.5" />
                <span className="truncate">
                  {isFileValue(value)
                    ? value.name
                    : currentUrl
                      ? "Current file is already uploaded"
                      : "No file selected"}
                </span>
                {currentUrl ? (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Open current
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="text-xs" />
          )}
        </Field>
      )}
    />
  );
}
