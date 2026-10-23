import type { HTMLInputTypeAttribute } from "react";

import { useId } from "react";

import { FieldError } from "./field-error.tsx";
import { useFieldContext } from "./form-context.ts";
import { getFieldError } from "./get-field-error.ts";

export function TextField({
  label,
  type = "text",
  autoComplete,
  inputMode,
  isRequired = false,
  hint,
  onBlur,
}: {
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: "numeric" | "decimal";
  isRequired?: boolean;
  hint?: string;
  onBlur?: () => void;
}) {
  const field = useFieldContext<string>();
  const id = useId();
  const error = getFieldError(field.state.meta.errors);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {isRequired ? `${label} *` : label}
      </label>
      <input
        id={id}
        name={field.name}
        type={type}
        value={field.state.value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={() => {
          field.handleBlur();
          onBlur?.();
        }}
        className="field-input"
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-gray-300">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
