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
import type { ExperienceForm } from "@/validations/experience-validation";

type FormExperienceProps = {
  form: UseFormReturn<ExperienceForm>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
};

export default function FormExperience({
  form,
  onSubmit,
  isLoading,
  type,
}: FormExperienceProps) {
  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{type} Experience</DialogTitle>
        <DialogDescription>
          Manage timeline entries, stack badges, and highlights.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid max-h-[64vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          <FormInput
            form={form}
            name="year_label"
            label="Year Label"
            placeholder="2026 - Sekarang"
          />
          <FormInput
            form={form}
            name="sort_order"
            label="Sort Order"
            type="number"
            placeholder="0"
          />
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="title"
              label="Title"
              placeholder="AI-assisted Fullstack Product Builder"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="description"
              label="Description"
              placeholder="Short timeline description..."
              type="textarea"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="stack"
              label="Stack"
              placeholder={"Next.js\nPostgreSQL\nDocker"}
              type="textarea"
            />
          </div>
          <div className="md:col-span-2">
            <FormInput
              form={form}
              name="highlights"
              label="Highlights"
              placeholder={"AI chat UX\nServer-side streaming\nPrompt workflow design"}
              type="textarea"
            />
          </div>
          <Controller
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <Field orientation="horizontal">
                <input
                  id="experience-is-active"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor="experience-is-active">Active</FieldLabel>
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
            {type === "Create" ? "Create Experience" : "Update Experience"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
