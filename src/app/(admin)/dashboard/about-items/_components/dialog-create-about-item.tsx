"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  INITIAL_ABOUT_ITEM_FORM,
  INITIAL_STATE_ABOUT_ITEM_FORM,
} from "@/constants/about-item-constant";
import type { AboutItemForm } from "@/validations/about-item-validation";
import { aboutItemFormSchema } from "@/validations/about-item-validation";
import createAboutItem from "../action";
import FormAboutItem from "./form-about-item";

export default function DialogCreateAboutItem({
  refetch,
  handleChangeAction,
}: {
  refetch: () => void;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<AboutItemForm>({
    resolver: zodResolver(aboutItemFormSchema),
    defaultValues: INITIAL_ABOUT_ITEM_FORM,
  });
  const [state, action, isPending] = useActionState(
    createAboutItem,
    INITIAL_STATE_ABOUT_ITEM_FORM,
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
      toast.error("Create about item failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("About item created successfully");
      form.reset(INITIAL_ABOUT_ITEM_FORM);
      handleChangeAction?.(false);
      refetch();
    }
  }, [form, handleChangeAction, refetch, state]);

  return (
    <FormAboutItem
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
      type="Create"
    />
  );
}
