import type { AgentFormValues } from "./agent-form.tsx";

import { readText } from "./form/read-text.ts";

export function readAgentInput(
  formData: FormData,
  canChangeRole: boolean,
): Omit<AgentFormValues, "role"> & { role?: string } {
  return {
    firstName: readText(formData, "firstName"),
    lastName: readText(formData, "lastName"),
    role: canChangeRole ? readText(formData, "role") : undefined,
  };
}
