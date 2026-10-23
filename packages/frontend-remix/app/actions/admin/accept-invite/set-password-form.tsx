import type { Handle } from "remix/component";

import { routes } from "../../../routes.ts";
import { FormAlert } from "../../../ui/form/form-alert.tsx";
import { SubmitButton } from "../../../ui/form/submit-button.tsx";
import { TextField } from "../../../ui/form/text-field.tsx";

export function SetPasswordForm(
  handle: Handle<{ passwordError?: string; error?: string }>,
) {
  return () => (
    <form
      method="post"
      action={routes.admin.acceptInvite.action.href()}
      noValidate
      class="space-y-6"
    >
      <TextField
        label="Nouveau mot de passe (8 caractères minimum)"
        name="password"
        type="password"
        autoComplete="new-password"
        isRequired
        error={handle.props.passwordError}
      />
      <FormAlert message={handle.props.error} />
      <SubmitButton label="Enregistrer le mot de passe" isFullWidth />
    </form>
  );
}
