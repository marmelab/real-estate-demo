import type { Handle } from "remix/component";

import { AGENT_ROLE_OPTIONS } from "@remix-v3-demo/domain/agent/agent-role-labels";

import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";

import { routes } from "../../../routes.ts";
import { FormAlert } from "../../../ui/form/form-alert.tsx";
import { SelectField } from "../../../ui/form/select-field.tsx";
import { SubmitButton } from "../../../ui/form/submit-button.tsx";
import { TextField } from "../../../ui/form/text-field.tsx";

export type InviteAgentValues = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export const EMPTY_INVITE: InviteAgentValues = {
  email: "",
  firstName: "",
  lastName: "",
  role: "agent",
};

export function InviteAgentForm(
  handle: Handle<{
    dialogId: string;
    values: InviteAgentValues;
    errors?: FieldErrors;
    error?: string;
  }>,
) {
  return () => {
    let { dialogId, values, errors = {}, error } = handle.props;

    return (
      <form
        method="post"
        action={routes.admin.agents.invite.href()}
        noValidate
        class="space-y-6"
      >
        <TextField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="off"
          value={values.email}
          isRequired
          error={errors.email}
        />
        <TextField
          label="Prénom"
          name="firstName"
          value={values.firstName}
          isRequired
          error={errors.firstName}
        />
        <TextField
          label="Nom"
          name="lastName"
          value={values.lastName}
          isRequired
          error={errors.lastName}
        />
        <SelectField
          label="Rôle"
          name="role"
          value={values.role}
          options={AGENT_ROLE_OPTIONS}
          error={errors.role}
        />
        <FormAlert message={error} />
        <div class="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            commandfor={dialogId}
            command="close"
            class="button-outline"
          >
            Annuler
          </button>
          <SubmitButton label="Inviter" />
        </div>
      </form>
    );
  };
}
