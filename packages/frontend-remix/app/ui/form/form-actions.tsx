import type { Handle, RemixNode } from "remix/component";

import { FormAlert } from "./form-alert.tsx";

export function FormActions(
  handle: Handle<{ error?: string; class?: string; children: RemixNode }>,
) {
  return () => (
    <div
      class={`border-obsidian-600 bg-obsidian-900 sticky bottom-0 mt-auto -mb-6 space-y-4 border-t py-4 md:-mb-10 ${handle.props.class ?? ""}`}
    >
      <FormAlert message={handle.props.error} />
      <div class="flex flex-wrap gap-4">{handle.props.children}</div>
    </div>
  );
}
