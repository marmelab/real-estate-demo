import type { ReactNode } from "react";

import { FormAlert } from "./form-alert.tsx";

export function FormActions({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-obsidian-600 bg-obsidian-900 sticky bottom-0 mt-auto -mb-6 space-y-4 border-t py-4 md:-mb-10">
      <FormAlert message={error} />
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}
