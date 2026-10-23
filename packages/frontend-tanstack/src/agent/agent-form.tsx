import type { AgentInput } from "@remix-v3-demo/domain/agent/agent-validator";
import type { Agent } from "@remix-v3-demo/domain/agent/model";

import { agentInputSchema } from "@remix-v3-demo/domain/agent/agent-validator";

import { ConfirmButton } from "../components/confirm-button.tsx";
import { useAppForm } from "../components/form/app-form.tsx";
import { FormActions } from "../components/form/form-actions.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { validateWith } from "../components/form/validate-with.ts";
import { AGENT_ROLE_OPTIONS } from "./agent-role-labels.ts";

export function AgentForm({
  agent,
  canChangeRole,
  onSubmit,
  onRemove,
}: {
  agent: Pick<Agent, "firstName" | "lastName" | "role">;
  canChangeRole: boolean;
  onSubmit: (input: AgentInput) => Promise<void>;
  onRemove?: () => Promise<void>;
}) {
  const { error, submit } = useSubmitError("Enregistrement impossible");
  const form = useAppForm({
    defaultValues: {
      firstName: agent.firstName,
      lastName: agent.lastName,
      role: agent.role,
    },
    validators: { onSubmit: validateWith(agentInputSchema) },
    onSubmit: ({ value }) =>
      submit(() =>
        onSubmit(
          agentInputSchema.parse(
            canChangeRole ? value : { ...value, role: undefined },
          ),
        ),
      ),
  });

  return (
    <form
      method="post"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="flex flex-1 flex-col gap-6"
    >
      <form.AppField name="firstName">
        {(field) => (
          <field.TextField
            label="Prénom"
            autoComplete="given-name"
            isRequired
          />
        )}
      </form.AppField>
      <form.AppField name="lastName">
        {(field) => (
          <field.TextField label="Nom" autoComplete="family-name" isRequired />
        )}
      </form.AppField>
      {canChangeRole && (
        <form.AppField name="role">
          {(field) => (
            <field.SelectField label="Rôle" options={AGENT_ROLE_OPTIONS} />
          )}
        </form.AppField>
      )}
      <FormActions error={error}>
        <form.AppForm>
          <form.SubmitButton label="Enregistrer" />
        </form.AppForm>
        {onRemove && (
          <ConfirmButton
            label="Retirer l'agent"
            title="Retirer cet agent ?"
            message="Il n'aura plus accès à l'espace agents."
            confirmLabel="Retirer"
            className="button-ghost"
            onConfirm={() => void submit(onRemove)}
          />
        )}
      </FormActions>
    </form>
  );
}
