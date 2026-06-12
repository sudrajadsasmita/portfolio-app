"use client";

import type { FormEvent } from "react";
import { useEffect } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import FormFile from "@/components/common/form-file";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import type { ProjectForm } from "@/validations/project-validation";

type FormProjectProps = {
  form: UseFormReturn<ProjectForm>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  currentImageUrl?: string | null;
  imagePreviewUrl?: string;
  onImageChange?: (file?: File, displayUrl?: string) => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function FormProject({
  form,
  onSubmit,
  isLoading,
  type,
  currentImageUrl,
  imagePreviewUrl,
  onImageChange,
}: FormProjectProps) {
  const title = form.watch("title");

  useEffect(() => {
    form.setValue("slug", slugify(title || ""), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [form, title]);

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{type} Project</DialogTitle>
        <DialogDescription>
          Manage project content, links, stack badges, and feature highlights.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid max-h-[64vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          <FormInput
            form={form}
            name="title"
            label="Title"
            placeholder="AI Chat Application"
          />
          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="project-slug">
                  Slug
                </label>
                <input
                  {...field}
                  id="project-slug"
                  readOnly
                  placeholder="auto-generated-from-title"
                  aria-invalid={fieldState.invalid}
                  className="h-8 w-full rounded-lg border border-input bg-muted px-2.5 py-1 text-sm text-muted-foreground outline-none"
                />
                {fieldState.error?.message ? (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="description"
              label="Description"
              placeholder="Short project description..."
              type="textarea"
            />
          </div>
          <FormFile
            form={form}
            name="image_url"
            label="Project Image"
            accept="image/png,image/jpeg,image/webp,image/gif"
            variant="image"
            currentUrl={currentImageUrl}
            previewUrl={imagePreviewUrl || currentImageUrl || undefined}
            description="Upload JPG, PNG, WEBP, or GIF. Max size 3MB."
            onFileChange={onImageChange}
          />
          <FormInput
            form={form}
            name="image_alt"
            label="Image Alt"
            placeholder="Project preview"
          />
          <FormInput
            form={form}
            name="mockup_label"
            label="Mockup Label"
            placeholder="SaaS Dashboard"
          />
          <FormInput
            form={form}
            name="sort_order"
            label="Sort Order"
            type="number"
            placeholder="0"
          />
          <FormInput
            form={form}
            name="demo_url"
            label="Demo URL"
            placeholder="https://..."
          />
          <FormInput
            form={form}
            name="source_url"
            label="Source URL"
            placeholder="https://github.com/..."
          />
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="case_study_url"
              label="Case Study URL"
              placeholder="#contact"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="stack"
              label="Stack"
              placeholder={"Next.js\nPostgreSQL\nOpenAI API"}
              type="textarea"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="highlights"
              label="Highlights"
              placeholder={"Streaming chat response\nConversation persistence\nDocker-ready deployment"}
              type="textarea"
            />
          </div>
          <Controller
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <Field orientation="horizontal">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor="is_featured">Featured project</FieldLabel>
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <Field orientation="horizontal">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor="is_published">Published</FieldLabel>
              </Field>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            {type === "Create" ? "Create Project" : "Update Project"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
