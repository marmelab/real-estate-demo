import { useId } from "react";

import { FieldError } from "./field-error.tsx";
import { useFieldContext } from "./form-context.ts";
import { getFieldError } from "./get-field-error.ts";

export function TextAreaField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const id = useId();
  const error = getFieldError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea
        id={id}
        name={field.name}
        value={field.state.value}
        rows={10}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className="field-input py-2"
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
