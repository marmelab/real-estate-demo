import type { Handle } from "remix/component";

import { FieldError } from "./field-error.tsx";

export function SelectField(
  handle: Handle<{
    id?: string;
    label: string;
    name: string;
    value: string;
    options: readonly (readonly [string, string])[];
    emptyLabel?: string;
    isRequired?: boolean;
    error?: string;
  }>,
) {
  return () => {
    let id = handle.props.id ?? handle.id;
    let { label, name, value, options, emptyLabel, error } = handle.props;
    let { isRequired = false } = handle.props;

    return (
      <div class="flex flex-col gap-2">
        <label htmlFor={id} class="field-label">
          {isRequired ? `${label} *` : label}
        </label>
        <select
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          class="field-input"
        >
          {emptyLabel !== undefined && (
            <option value="" selected={value === ""}>
              {emptyLabel}
            </option>
          )}
          {options.map(([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
              selected={optionValue === value}
            >
              {optionLabel}
            </option>
          ))}
        </select>
        <FieldError id={`${id}-error`} message={error} />
      </div>
    );
  };
}
