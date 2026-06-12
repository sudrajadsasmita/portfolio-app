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
import { INITIAL_STATE_EXPERIENCE_FORM } from "@/constants/experience-constant";
import type { PortfolioExperienceRow } from "@/types/experience";
import { deleteExperience } from "../action";

type DialogDeleteExperienceProps = {
  refetch: () => void;
  currentData?: PortfolioExperienceRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

export default function DialogDeleteExperience({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteExperienceProps) {
  const [state, action, isPending] = useActionState(
    deleteExperience,
    INITIAL_STATE_EXPERIENCE_FORM,
  );

  const onDelete = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id ?? "");
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Delete experience failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Experience deleted successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Experience</DialogTitle>
          <DialogDescription>
            This will permanently delete {currentData?.title || "this entry"}.
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
