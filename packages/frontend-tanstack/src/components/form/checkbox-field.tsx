import { useFieldContext } from "./form-context.ts";

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();

  return (
    <label className="flex min-h-11 items-center gap-3 text-sm text-gray-200">
      <input
        type="checkbox"
        name={field.name}
        checked={field.state.value}
        onChange={(event) => field.handleChange(event.target.checked)}
        onBlur={field.handleBlur}
        className="accent-gold focus-visible:outline-gold size-5 focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      {label}
    </label>
  );
}
