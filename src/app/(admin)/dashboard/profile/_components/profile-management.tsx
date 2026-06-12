"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  INITIAL_PROFILE_FORM,
  INITIAL_STATE_PROFILE_FORM,
} from "@/constants/profile-constant";
import type { Profile } from "@/types/auth";
import type { ProfileForm } from "@/validations/profile-validation";
import { profileFormSchema } from "@/validations/profile-validation";
import { deleteProfile, saveProfile } from "../action";
import FormProfile from "./form-profile";

type ProfileManagementProps = {
  initialProfile: Profile | null;
  errorMessage?: string;
};

function getDefaultValues(profile: Profile | null): ProfileForm {
  return {
    ...INITIAL_PROFILE_FORM,
    name: profile?.name ?? "",
    title: profile?.title ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    avatar_url: profile?.avatar_url ?? "",
    resume_url: profile?.resume_url ?? "",
    location: profile?.location ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    availability: profile?.availability ?? "",
    github: profile?.social_links?.github ?? "",
    linkedin: profile?.social_links?.linkedin ?? "",
    website: profile?.social_links?.website ?? "",
    instagram: profile?.social_links?.instagram ?? "",
    twitter: profile?.social_links?.twitter ?? "",
    facebook: profile?.social_links?.facebook ?? "",
    youtube: profile?.social_links?.youtube ?? "",
    gitlab: profile?.social_links?.gitlab ?? "",
    medium: profile?.social_links?.medium ?? "",
    devto: profile?.social_links?.devto ?? "",
  };
}

export default function ProfileManagement({
  initialProfile,
  errorMessage,
}: ProfileManagementProps) {
  const router = useRouter();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getDefaultValues(initialProfile),
  });
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(
    initialProfile?.avatar_url ?? undefined,
  );

  const [saveState, saveAction, isPendingSave] = useActionState(
    saveProfile,
    INITIAL_STATE_PROFILE_FORM,
  );
  const [deleteState, deleteAction, isPendingDelete] = useActionState(
    deleteProfile,
    INITIAL_STATE_PROFILE_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (initialProfile?.id) {
      formData.append("id", initialProfile.id);
      formData.append("old_avatar_url", initialProfile.avatar_url ?? "");
      formData.append("old_resume_url", initialProfile.resume_url ?? "");
    }

    startTransition(() => {
      saveAction(formData);
    });
  });

  const onDelete = () => {
    if (!initialProfile?.id) {
      return;
    }

    const formData = new FormData();
    formData.append("id", initialProfile.id);

    startTransition(() => {
      deleteAction(formData);
    });
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error("Get profile failed", {
        description: errorMessage,
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (saveState.status === "error") {
      toast.error("Save profile failed", {
        description: saveState.errors?._form?.[0],
      });
    }

    if (saveState.status === "success") {
      toast.success("Profile saved successfully");
      router.refresh();
    }
  }, [router, saveState]);

  useEffect(() => {
    if (deleteState.status === "error") {
      toast.error("Delete profile failed", {
        description: deleteState.errors?._form?.[0],
      });
    }

    if (deleteState.status === "success") {
      toast.success("Profile archived successfully");
      form.reset(INITIAL_PROFILE_FORM);
      router.refresh();
    }
  }, [deleteState, form, router]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage the main profile content used by the portfolio landing page.
          </p>
        </div>
        {initialProfile?.id ? (
          <Button
            type="button"
            variant="destructive"
            disabled={isPendingDelete}
            onClick={onDelete}
          >
            <Trash2 />
            Archive Profile
          </Button>
        ) : null}
      </div>

      <FormProvider {...form}>
        <FormProfile
          form={form}
          onSubmit={onSubmit}
          isLoading={isPendingSave}
          type={initialProfile ? "Update" : "Create"}
          currentAvatarUrl={initialProfile?.avatar_url}
          currentResumeUrl={initialProfile?.resume_url}
          avatarPreviewUrl={avatarPreviewUrl}
          onAvatarChange={(_, displayUrl) => setAvatarPreviewUrl(displayUrl)}
        />
      </FormProvider>
    </div>
  );
}
