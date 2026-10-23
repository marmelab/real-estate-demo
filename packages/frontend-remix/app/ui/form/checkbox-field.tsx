import type { Handle } from "remix/component";

export function CheckboxField(
  handle: Handle<{ label: string; name: string; isChecked: boolean }>,
) {
  return () => (
    <label class="flex min-h-11 items-center gap-3 text-sm text-gray-200">
      <input
        type="checkbox"
        name={handle.props.name}
        defaultChecked={handle.props.isChecked}
        class="accent-gold focus-visible:outline-gold size-5 focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      {handle.props.label}
    </label>
  );
}
