import type { Handle } from "remix/component";

export function SubmitButton(
  handle: Handle<{ label: string; isFullWidth?: boolean }>,
) {
  return () => (
    <button
      type="submit"
      class={handle.props.isFullWidth ? "button-gold w-full" : "button-gold"}
    >
      {handle.props.label}
    </button>
  );
}
