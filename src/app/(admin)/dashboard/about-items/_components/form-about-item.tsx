"use client";

import type { FormEvent } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import type { AboutItemForm } from "@/validations/about-item-validation";

type FormAboutItemProps = {
  form: UseFormReturn<AboutItemForm>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
};

export default function FormAboutItem({
  form,
  onSubmit,
  isLoading,
  type,
}: FormAboutItemProps) {
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{type} About Item</DialogTitle>
        <DialogDescription>
          Manage cards used by the landing about section.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            form={form}
            name="title"
            label="Title"
            placeholder="Frontend Development"
          />
          <FormInput
            form={form}
            name="icon"
            label="Icon"
            placeholder="LayoutDashboard"
          />
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="description"
              label="Description"
              placeholder="Responsive Next.js interfaces..."
              type="textarea"
            />
          </div>
          <FormInput
            form={form}
            name="sort_order"
            label="Sort Order"
            type="number"
            placeholder="0"
          />
          <Controller
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <Field orientation="horizontal">
                <input
                  id="about-item-is-active"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor="about-item-is-active">Active</FieldLabel>
              </Field>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : null}
            {type === "Create" ? "Create About Item" : "Update About Item"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
