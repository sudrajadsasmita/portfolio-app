"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_SKILL_FORM } from "@/constants/skill-constant";
import type { PortfolioSkillRow } from "@/types/skill";
import type { SkillForm } from "@/validations/skill-validation";
import { skillFormSchema } from "@/validations/skill-validation";
import { updateSkill } from "../action";
import FormSkill from "./form-skill";

type DialogUpdateSkillProps = {
  refetch: () => void;
  currentData?: PortfolioSkillRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

function skillToForm(skill?: PortfolioSkillRow): SkillForm {
  return {
    category: skill?.category ?? "Frontend",
    name: skill?.name ?? "",
    description: skill?.description ?? "",
    icon: skill?.icon ?? "",
    sort_order: skill?.sort_order ?? 0,
    is_active: skill?.is_active ?? true,
  };
}

export default function DialogUpdateSkill({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateSkillProps) {
  const form = useForm<SkillForm>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: skillToForm(currentData),
  });
  const [state, action, isPending] = useActionState(
    updateSkill,
    INITIAL_STATE_SKILL_FORM,
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
      form.reset(skillToForm(currentData));
    }
  }, [currentData, form]);

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update skill failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Skill updated successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormSkill
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
      />
    </Dialog>
  );
}
