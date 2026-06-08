import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel, FieldSet } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field: { ...rest }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {type === "textarea" ? (
            <Textarea
              {...rest}
              id={rest.name}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <Input
              {...rest}
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
          )}

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="text-xs" />
          )}
        </Field>
      )}
    />
  );
}
