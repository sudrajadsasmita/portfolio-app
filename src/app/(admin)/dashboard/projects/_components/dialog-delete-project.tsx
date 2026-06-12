"use client";

import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { INITIAL_STATE_PROJECT_FORM } from "@/constants/project-constant";
import type { PortfolioProjectRow } from "@/types/project";
import { deleteProject } from "../action";

type DialogDeleteProjectProps = {
  refetch: () => void;
  currentData?: PortfolioProjectRow;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
};

export default function DialogDeleteProject({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteProjectProps) {
  const [state, action, isPending] = useActionState(
    deleteProject,
    INITIAL_STATE_PROJECT_FORM,
  );

  const onDelete = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id ?? "");
    formData.append("image_url", currentData?.image_url ?? "");
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state.status === "error") {
      toast.error("Delete project failed", {
        description: state.errors?._form?.[0],
      });
    }

    if (state.status === "success") {
      toast.success("Project deleted successfully");
      handleChangeAction?.(false);
      refetch();
    }
  }, [handleChangeAction, refetch, state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            This will permanently delete {currentData?.title || "this project"} and
            its stack/highlight records.
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
