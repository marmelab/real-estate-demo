import type { Handle } from "remix/component";

import { FieldError } from "./field-error.tsx";

export function TextAreaField(
  handle: Handle<{
    label: string;
    name: string;
    value: string;
    error?: string;
  }>,
) {
  return () => {
    let { id } = handle;
    let { label, name, value, error } = handle.props;

    return (
      <div class="flex flex-col gap-2">
        <label htmlFor={id} class="field-label">
          {label}
        </label>
        <textarea
          id={id}
          name={name}
          rows={10}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          defaultValue={value}
          class="field-input py-2"
        />
        <FieldError id={`${id}-error`} message={error} />
      </div>
    );
  };
}
