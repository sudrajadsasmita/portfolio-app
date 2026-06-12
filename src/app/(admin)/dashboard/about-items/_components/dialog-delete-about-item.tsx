"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INITIAL_STATE_ABOUT_ITEM_FORM } from "@/constants/about-item-constant";
import type { PortfolioAboutItemRow } from "@/types/about-item";
import { deleteAboutItem } from "../action";

type DialogDeleteAboutItemProps = {
  refetch: () => void;
  currentData?: PortfolioAboutItemRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

export default function DialogDeleteAboutItem({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteAboutItemProps) {
  const [state, action, isPending] = useActionState(
    deleteAboutItem,
    INITIAL_STATE_ABOUT_ITEM_FORM,
  );

  const onDelete = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id ?? "");
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Delete about item failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("About item deleted successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete About Item</DialogTitle>
          <DialogDescription>
            This will permanently delete {currentData?.title || "this item"}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={onDelete}
          >
            <Trash2 />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
