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
import { INITIAL_STATE_SKILL_FORM } from "@/constants/skill-constant";
import type { PortfolioSkillRow } from "@/types/skill";
import { deleteSkill } from "../action";

type DialogDeleteSkillProps = {
  refetch: () => void;
  currentData?: PortfolioSkillRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

export default function DialogDeleteSkill({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteSkillProps) {
  const [state, action, isPending] = useActionState(
    deleteSkill,
    INITIAL_STATE_SKILL_FORM,
  );

  const onDelete = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id ?? "");
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Delete skill failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Skill deleted successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Skill</DialogTitle>
          <DialogDescription>
            This will permanently delete {currentData?.name || "this skill"}.
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
