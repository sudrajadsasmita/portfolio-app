"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_EXPERIENCE_FORM } from "@/constants/experience-constant";
import type { PortfolioExperienceRow } from "@/types/experience";
import type { ExperienceForm } from "@/validations/experience-validation";
import { experienceFormSchema } from "@/validations/experience-validation";
import { updateExperience } from "../action";
import FormExperience from "./form-experience";

type DialogUpdateExperienceProps = {
  refetch: () => void;
  currentData?: PortfolioExperienceRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

function experienceToForm(experience?: PortfolioExperienceRow): ExperienceForm {
  return {
    year_label: experience?.year_label ?? "",
    title: experience?.title ?? "",
    description: experience?.description ?? "",
    stack:
      experience?.portfolio_experience_stacks
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.name)
        .join("\n") ?? "",
    highlights:
      experience?.portfolio_experience_highlights
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.highlight)
        .join("\n") ?? "",
    sort_order: experience?.sort_order ?? 0,
    is_active: experience?.is_active ?? true,
  };
}

export default function DialogUpdateExperience({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateExperienceProps) {
  const form = useForm<ExperienceForm>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: experienceToForm(currentData),
  });
  const [state, action, isPending] = useActionState(
    updateExperience,
    INITIAL_STATE_EXPERIENCE_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", currentData?.id ?? "");
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (currentData) {
      form.reset(experienceToForm(currentData));
    }
  }, [currentData, form]);

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update experience failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Experience updated successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormExperience
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
      />
    </Dialog>
  );
}
