import type { SignIn } from "@remix-v3-demo/domain/auth/auth-validator";

import { signInSchema } from "@remix-v3-demo/domain/auth/auth-validator";

import { useAppForm } from "../components/form/app-form.tsx";
import { FormAlert } from "../components/form/form-alert.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { validateWith } from "../components/form/validate-with.ts";

export function SignInForm({
  onSubmit,
}: {
  onSubmit: (credentials: SignIn) => Promise<void>;
}) {
  const { error, submit } = useSubmitError("Identifiants invalides");
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: validateWith(signInSchema) },
    onSubmit: ({ value }) => submit(() => onSubmit(signInSchema.parse(value))),
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
            autoComplete="email"
            isRequired
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.TextField
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            isRequired
          />
        )}
      </form.AppField>
      <FormAlert message={error} />
      <form.AppForm>
        <form.SubmitButton label="Se connecter" isFullWidth />
      </form.AppForm>
    </form>
  );
}
