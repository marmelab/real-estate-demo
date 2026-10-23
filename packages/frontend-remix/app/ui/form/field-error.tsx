import type { Handle } from "remix/component";

export function FieldError(handle: Handle<{ id: string; message?: string }>) {
  return () =>
    handle.props.message ? (
      <p id={handle.props.id} class="text-sm text-red-300">
        {handle.props.message}
      </p>
    ) : null;
}
