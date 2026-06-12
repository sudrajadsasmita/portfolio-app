"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  INITIAL_PROJECT_FORM,
  INITIAL_STATE_PROJECT_FORM,
} from "@/constants/project-constant";
import type { ProjectForm } from "@/validations/project-validation";
import { projectFormSchema } from "@/validations/project-validation";
import createProject from "../action";
import FormProject from "./form-project";

export default function DialogCreateProject({
  refetch,
  handleChangeAction,
}: {
  refetch: () => void;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: INITIAL_PROJECT_FORM,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [state, action, isPending] = useActionState(
    createProject,
    INITIAL_STATE_PROJECT_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value instanceof File ? value : String(value));
    });

    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Create project failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Project created successfully");
      form.reset(INITIAL_PROJECT_FORM);
      handleChangeAction?.(false);
      refetch();
    }
  }, [form, handleChangeAction, refetch, state]);

  return (
    <FormProject
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
      type="Create"
      imagePreviewUrl={imagePreviewUrl}
      onImageChange={(_, displayUrl) => setImagePreviewUrl(displayUrl)}
    />
  );
}
