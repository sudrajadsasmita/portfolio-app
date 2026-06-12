"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_ABOUT_ITEM_FORM } from "@/constants/about-item-constant";
import type { PortfolioAboutItemRow } from "@/types/about-item";
import type { AboutItemForm } from "@/validations/about-item-validation";
import { aboutItemFormSchema } from "@/validations/about-item-validation";
import { updateAboutItem } from "../action";
import FormAboutItem from "./form-about-item";

type DialogUpdateAboutItemProps = {
  refetch: () => void;
  currentData?: PortfolioAboutItemRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

function aboutItemToForm(item?: PortfolioAboutItemRow): AboutItemForm {
  return {
    title: item?.title ?? "",
    description: item?.description ?? "",
    icon: item?.icon ?? "",
    sort_order: item?.sort_order ?? 0,
    is_active: item?.is_active ?? true,
  };
}

export default function DialogUpdateAboutItem({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateAboutItemProps) {
  const form = useForm<AboutItemForm>({
    resolver: zodResolver(aboutItemFormSchema),
    defaultValues: aboutItemToForm(currentData),
  });
  const [state, action, isPending] = useActionState(
    updateAboutItem,
    INITIAL_STATE_ABOUT_ITEM_FORM,
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
      form.reset(aboutItemToForm(currentData));
    }
  }, [currentData, form]);

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Update about item failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("About item updated successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormAboutItem
        form={form}
        onSubmit={onSubmit}
        isLoading={isPending}
        type="Update"
      />
    </Dialog>
  );
}
