"use client";

import type { FormEvent } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import FormFile from "@/components/common/form-file";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";

type FormProfileProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  currentAvatarUrl?: string | null;
  currentResumeUrl?: string | null;
  avatarPreviewUrl?: string;
  onAvatarChange?: (file?: File, displayUrl?: string) => void;
};

export default function FormProfile<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  currentAvatarUrl,
  currentResumeUrl,
  avatarPreviewUrl,
  onAvatarChange,
}: FormProfileProps<T>) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Profile Identity</h2>
          <p className="text-sm text-muted-foreground">
            Main data used by the landing hero, about text, and contact area.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            form={form}
            name={"name" as Path<T>}
            label="Name"
            placeholder="Sudrajad Dwi Sasmita"
          />
          <FormInput
            form={form}
            name={"title" as Path<T>}
            label="Title"
            placeholder="Fullstack Developer"
          />
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name={"headline" as Path<T>}
              label="Headline"
              placeholder="Backend-focused Fullstack Developer..."
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name={"bio" as Path<T>}
              label="Bio"
              placeholder="Write a short professional bio..."
              type="textarea"
            />
          </div>
          <FormInput
            form={form}
            name={"availability" as Path<T>}
            label="Availability"
            placeholder="Open to work"
          />
          <FormInput
            form={form}
            name={"location" as Path<T>}
            label="Location"
            placeholder="Mojokerto, Indonesia"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Contact & Assets</h2>
          <p className="text-sm text-muted-foreground">
            Contact channels and public asset URLs for profile image or CV.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            form={form}
            name={"email" as Path<T>}
            label="Email"
            placeholder="sudrajad.dwi@gmail.com"
            type="email"
          />
          <FormInput
            form={form}
            name={"phone" as Path<T>}
            label="Phone"
            placeholder="085607431436"
          />
          <FormFile
            form={form}
            name={"avatar_url" as Path<T>}
            label="Avatar"
            accept="image/png,image/jpeg,image/webp,image/gif"
            variant="image"
            currentUrl={currentAvatarUrl}
            previewUrl={avatarPreviewUrl || currentAvatarUrl || undefined}
            description="Upload JPG, PNG, WEBP, or GIF. Max size 2MB."
            onFileChange={onAvatarChange}
          />
          <FormFile
            form={form}
            name={"resume_url" as Path<T>}
            label="Resume PDF"
            accept="application/pdf"
            variant="document"
            currentUrl={currentResumeUrl}
            description="Upload PDF resume. Max size 5MB."
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <p className="text-sm text-muted-foreground">
            Stored as JSONB in profiles.social_links.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            form={form}
            name={"github" as Path<T>}
            label="GitHub"
            placeholder="https://github.com/username"
          />
          <FormInput
            form={form}
            name={"linkedin" as Path<T>}
            label="LinkedIn"
            placeholder="https://linkedin.com/in/username"
          />
          <FormInput
            form={form}
            name={"website" as Path<T>}
            label="Website"
            placeholder="https://portofolio.example.com"
          />
          <FormInput
            form={form}
            name={"instagram" as Path<T>}
            label="Instagram"
            placeholder="https://instagram.com/username"
          />
          <FormInput
            form={form}
            name={"twitter" as Path<T>}
            label="Twitter / X"
            placeholder="https://x.com/username"
          />
          <FormInput
            form={form}
            name={"gitlab" as Path<T>}
            label="GitLab"
            placeholder="https://gitlab.com/username"
          />
          <FormInput
            form={form}
            name={"medium" as Path<T>}
            label="Medium"
            placeholder="https://medium.com/@username"
          />
          <FormInput
            form={form}
            name={"devto" as Path<T>}
            label="Dev.to"
            placeholder="https://dev.to/username"
          />
          <FormInput
            form={form}
            name={"facebook" as Path<T>}
            label="Facebook"
            placeholder="https://facebook.com/username"
          />
          <FormInput
            form={form}
            name={"youtube" as Path<T>}
            label="YouTube"
            placeholder="https://youtube.com/@username"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
          {type === "Create" ? "Create Profile" : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
