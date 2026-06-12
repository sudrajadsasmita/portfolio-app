"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_PROJECT_FORM } from "@/constants/project-constant";
import type { PortfolioProjectRow } from "@/types/project";
import type { ProjectForm } from "@/validations/project-validation";
import { projectFormSchema } from "@/validations/project-validation";
import { updateProject } from "../action";
import FormProject from "./form-project";

type DialogUpdateProjectProps = {
  refetch: () => void;
  currentData?: PortfolioProjectRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

function projectToForm(project?: PortfolioProjectRow): ProjectForm {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    image_url: project?.image_url ?? "",
    image_alt: project?.image_alt ?? "",
    mockup_label: project?.mockup_label ?? "",
    demo_url: project?.demo_url ?? "",
    source_url: project?.source_url ?? "",
    case_study_url: project?.case_study_url ?? "",
    stack:
      project?.portfolio_project_stacks
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.name)
        .join("\n") ?? "",
    highlights:
      project?.portfolio_project_highlights
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.highlight)
        .join("\n") ?? "",
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? true,
    sort_order: project?.sort_order ?? 0,
  };
}

export default function DialogUpdateProject({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateProjectProps) {
  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: projectToForm(currentData),
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [state, action, isPending] = useActionState(
    updateProject,
    INITIAL_STATE_PROJECT_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value instanceof File ? value : String(value));
    });
    formData.append("id", currentData?.id ?? "");
    formData.append("old_image_url", currentData?.image_url ?? "");

    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (currentData) {
      form.reset(projectToForm(currentData));
    }
  }, [currentData, form]);

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update project failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Project updated successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormProject
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
        currentImageUrl={currentData?.image_url}
        imagePreviewUrl={imagePreviewUrl || currentData?.image_url || undefined}
        onImageChange={(_, displayUrl) => setImagePreviewUrl(displayUrl)}
      />
    </Dialog>
  );
}
