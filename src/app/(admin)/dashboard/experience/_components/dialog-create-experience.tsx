"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  INITIAL_EXPERIENCE_FORM,
  INITIAL_STATE_EXPERIENCE_FORM,
} from "@/constants/experience-constant";
import type { ExperienceForm } from "@/validations/experience-validation";
import { experienceFormSchema } from "@/validations/experience-validation";
import createExperience from "../action";
import FormExperience from "./form-experience";

export default function DialogCreateExperience({
  refetch,
  handleChangeAction,
}: {
  refetch: () => void;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<ExperienceForm>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: INITIAL_EXPERIENCE_FORM,
  });
  const [state, action, isPending] = useActionState(
    createExperience,
    INITIAL_STATE_EXPERIENCE_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    startTransition(() => action(formData));
  });

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Create experience failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Experience created successfully");
      form.reset(INITIAL_EXPERIENCE_FORM);
      handleChangeAction?.(false);
      refetch();
    }
  }, [form, handleChangeAction, refetch, state]);

  return (
    <FormExperience
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
      type="Create"
    />
  );
}
