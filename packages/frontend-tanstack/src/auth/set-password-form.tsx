import type { SetPassword } from "@remix-v3-demo/domain/auth/auth-validator";

import { setPasswordSchema } from "@remix-v3-demo/domain/auth/auth-validator";

import { useAppForm } from "../components/form/app-form.tsx";
import { FormAlert } from "../components/form/form-alert.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { validateWith } from "../components/form/validate-with.ts";

export function SetPasswordForm({
  onSubmit,
}: {
  onSubmit: (input: SetPassword) => Promise<void>;
}) {
  const { error, submit } = useSubmitError(
    "Le mot de passe n'a pas pu être enregistré",
  );
  const form = useAppForm({
    defaultValues: { password: "" },
    validators: { onSubmit: validateWith(setPasswordSchema) },
    onSubmit: ({ value }) =>
      submit(() => onSubmit(setPasswordSchema.parse(value))),
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
      <form.AppField name="password">
        {(field) => (
          <field.TextField
            label="Nouveau mot de passe (8 caractères minimum)"
            type="password"
            autoComplete="new-password"
            isRequired
          />
        )}
      </form.AppField>
      <FormAlert message={error} />
      <form.AppForm>
        <form.SubmitButton label="Enregistrer le mot de passe" isFullWidth />
      </form.AppForm>
    </form>
  );
}
