import type { Handle } from "remix/component";

import { FieldError } from "./field-error.tsx";

export type TextFieldProps = {
  id?: string;
  label: string;
  name: string;
  value?: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  inputMode?: "numeric" | "decimal";
  isRequired?: boolean;
  hint?: string;
  error?: string;
};

export function TextField(handle: Handle<TextFieldProps>) {
  return () => {
    let id = handle.props.id ?? handle.id;
    let {
      label,
      name,
      value,
      type = "text",
      autoComplete,
      inputMode,
    } = handle.props;
    let { isRequired = false, hint, error } = handle.props;
    let describedBy = [hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ");

    return (
      <div class="flex flex-col gap-2">
        <label htmlFor={id} class="field-label">
          {isRequired ? `${label} *` : label}
        </label>
        <input
          id={id}
          name={name}
          type={type as "text"}
          defaultValue={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          class="field-input"
        />
        {hint && (
          <p id={`${id}-hint`} class="text-sm text-gray-300">
            {hint}
          </p>
        )}
        <FieldError id={`${id}-error`} message={error} />
      </div>
    );
  };
}
