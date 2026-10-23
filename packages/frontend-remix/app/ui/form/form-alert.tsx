import type { Handle } from "remix/component";

export function FormAlert(handle: Handle<{ message?: string }>) {
  return () => (
    <p aria-live="polite" class="text-sm text-red-300 empty:hidden">
      {handle.props.message}
    </p>
  );
}
