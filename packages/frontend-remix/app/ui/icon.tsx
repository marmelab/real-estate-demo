import type { IconNode } from "lucide";
import type { Handle } from "remix/component";

import { jsx } from "remix/component/jsx-runtime";

export function Icon(
  handle: Handle<{ icon: IconNode; class: string; strokeWidth?: number }>,
) {
  return () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={handle.props.strokeWidth ?? 2}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class={handle.props.class}
    >
      {handle.props.icon.map(([tag, attrs], index) => jsx(tag, attrs, index))}
    </svg>
  );
}
