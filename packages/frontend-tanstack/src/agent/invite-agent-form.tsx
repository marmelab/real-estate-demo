import type { InviteAgent } from "@remix-v3-demo/domain/agent/agent-validator";

import { inviteAgentSchema } from "@remix-v3-demo/domain/agent/agent-validator";

import { useAppForm } from "../components/form/app-form.tsx";
import { FormAlert } from "../components/form/form-alert.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { validateWith } from "../components/form/validate-with.ts";
import { AGENT_ROLE_OPTIONS } from "./agent-role-labels.ts";

export function InviteAgentForm({
  onSubmit,
  onInvited,
  onCancel,
}: {
  onSubmit: (invite: InviteAgent) => Promise<void>;
  onInvited: (email: string) => void;
  onCancel: () => void;
}) {
  const { error, submit } = useSubmitError(
    "L'invitation n'a pas pu être envoyée",
  );
  const form = useAppForm({
    defaultValues: { email: "", firstName: "", lastName: "", role: "agent" },
    validators: { onSubmit: validateWith(inviteAgentSchema) },
    onSubmit: ({ value }) =>
      submit(async () => {
        const invite = inviteAgentSchema.parse(value);
        await onSubmit(invite);
        form.reset();
        onInvited(invite.email);
      }),
  });

  return (
    <form
      method="post"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            label="E-mail"
            type="email"
            autoComplete="off"
            isRequired
          />
        )}
      </form.AppField>
      <form.AppField name="firstName">
        {(field) => <field.TextField label="Prénom" isRequired />}
      </form.AppField>
      <form.AppField name="lastName">
        {(field) => <field.TextField label="Nom" isRequired />}
      </form.AppField>
      <form.AppField name="role">
        {(field) => (
          <field.SelectField label="Rôle" options={AGENT_ROLE_OPTIONS} />
        )}
      </form.AppField>
      <FormAlert message={error} />
      <div className="flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            form.reset();
            onCancel();
          }}
          className="button-outline"
        >
          Annuler
        </button>
        <form.AppForm>
          <form.SubmitButton label="Inviter" />
        </form.AppForm>
      </div>
    </form>
  );
}
