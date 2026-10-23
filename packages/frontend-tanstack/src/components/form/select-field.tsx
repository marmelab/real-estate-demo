import { useId } from "react";

import { FieldError } from "./field-error.tsx";
import { useFieldContext } from "./form-context.ts";
import { getFieldError } from "./get-field-error.ts";

export function SelectField({
  label,
  options,
  emptyLabel,
  isRequired = false,
}: {
  label: string;
  options: readonly (readonly [string, string])[];
  emptyLabel?: string;
  isRequired?: boolean;
}) {
  const field = useFieldContext<string>();
  const id = useId();
  const error = getFieldError(field.state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {isRequired ? `${label} *` : label}
      </label>
      <select
        id={id}
        name={field.name}
        value={field.state.value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        className="field-input"
      >
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
