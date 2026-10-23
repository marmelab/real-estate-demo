import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { Handle } from "remix/component";

import { AGENT_ROLE_OPTIONS } from "@remix-v3-demo/domain/agent/agent-role-labels";

import type { FieldErrors } from "./form/get-field-errors.ts";

import { ConfirmButton } from "./confirm-button.tsx";
import { FormActions } from "./form/form-actions.tsx";
import { SelectField } from "./form/select-field.tsx";
import { SubmitButton } from "./form/submit-button.tsx";
import { TextField } from "./form/text-field.tsx";

export type AgentFormValues = Pick<Agent, "firstName" | "lastName" | "role">;

export function AgentForm(
  handle: Handle<{
    action: string;
    values: AgentFormValues;
    canChangeRole: boolean;
    canRemove?: boolean;
    errors?: FieldErrors;
    error?: string;
  }>,
) {
  return () => {
    let {
      action,
      values,
      canChangeRole,
      canRemove,
      errors = {},
      error,
    } = handle.props;

    return (
      <form
        method="post"
        action={action}
        noValidate
        class="flex flex-1 flex-col gap-6"
      >
        <TextField
          label="Prénom"
          name="firstName"
          autoComplete="given-name"
          value={values.firstName}
          isRequired
          error={errors.firstName}
        />
        <TextField
          label="Nom"
          name="lastName"
          autoComplete="family-name"
          value={values.lastName}
          isRequired
          error={errors.lastName}
        />
        {canChangeRole && (
          <SelectField
            label="Rôle"
            name="role"
            value={values.role}
            options={AGENT_ROLE_OPTIONS}
            error={errors.role}
          />
        )}
        <FormActions error={error}>
          <SubmitButton label="Enregistrer" />
          {canRemove && (
            <ConfirmButton
              label="Retirer l'agent"
              title="Retirer cet agent ?"
              message="Il n'aura plus accès à l'espace agents."
              confirmLabel="Retirer"
              class="button-ghost"
              submitter={{ name: "_method", value: "DELETE" }}
            />
          )}
        </FormActions>
      </form>
    );
  };
}
