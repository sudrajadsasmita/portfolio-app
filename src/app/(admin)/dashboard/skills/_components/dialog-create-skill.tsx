"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  INITIAL_SKILL_FORM,
  INITIAL_STATE_SKILL_FORM,
} from "@/constants/skill-constant";
import type { SkillForm } from "@/validations/skill-validation";
import { skillFormSchema } from "@/validations/skill-validation";
import createSkill from "../action";
import FormSkill from "./form-skill";

export default function DialogCreateSkill({
  refetch,
  handleChangeAction,
}: {
  refetch: () => void;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<SkillForm>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: INITIAL_SKILL_FORM,
  });
  const [state, action, isPending] = useActionState(
    createSkill,
    INITIAL_STATE_SKILL_FORM,
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
      toast.error("Create skill failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Skill created successfully");
      form.reset(INITIAL_SKILL_FORM);
      handleChangeAction?.(false);
      refetch();
    }
  }, [form, handleChangeAction, refetch, state]);

  return (
    <FormSkill
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
      type="Create"
    />
  );
}
