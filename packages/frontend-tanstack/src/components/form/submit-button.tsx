import { useFormContext } from "./form-context.ts";

export function SubmitButton({
  label,
  isFullWidth = false,
}: {
  label: string;
  isFullWidth?: boolean;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          type="submit"
          disabled={isSubmitting}
          className={isFullWidth ? "button-gold w-full" : "button-gold"}
        >
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}
