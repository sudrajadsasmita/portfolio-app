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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SKILL_CATEGORY_OPTIONS } from "@/constants/skill-constant";
import type { SkillForm } from "@/validations/skill-validation";

type FormSkillProps = {
  form: UseFormReturn<SkillForm>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
};

export default function FormSkill({
  form,
  onSubmit,
  isLoading,
  type,
}: FormSkillProps) {
  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{type} Skill</DialogTitle>
        <DialogDescription>
          Manage skill items used by the landing tech stack section.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="skill-category">Category</FieldLabel>
                <select
                  {...field}
                  id="skill-category"
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {SKILL_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} className="text-xs" />
                ) : null}
              </Field>
            )}
          />
          <FormInput
            form={form}
            name="name"
            label="Name"
            placeholder="Next.js"
          />
          <FormInput
            form={form}
            name="icon"
            label="Icon"
            placeholder="Code2"
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
              name="description"
              label="Description"
              placeholder="Modern UI systems and typed client experiences."
              type="textarea"
            />
          </div>
          <Controller
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <Field orientation="horizontal">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor="is_active">Active</FieldLabel>
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
            {type === "Create" ? "Create Skill" : "Update Skill"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
