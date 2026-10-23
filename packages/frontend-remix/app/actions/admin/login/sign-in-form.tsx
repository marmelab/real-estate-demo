import type { Handle } from "remix/component";

import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";

import { FormAlert } from "../../../ui/form/form-alert.tsx";
import { SubmitButton } from "../../../ui/form/submit-button.tsx";
import { TextField } from "../../../ui/form/text-field.tsx";

export function SignInForm(
  handle: Handle<{
    action: string;
    email?: string;
    errors?: FieldErrors;
    error?: string;
  }>,
) {
  return () => {
    let { action, email, errors = {}, error } = handle.props;

    return (
      <form method="post" action={action} noValidate class="space-y-6">
        <TextField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          isRequired
          error={errors.email}
        />
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          isRequired
          error={errors.password}
        />
        <FormAlert message={error} />
        <SubmitButton label="Se connecter" isFullWidth />
      </form>
    );
  };
}
