import type { RemixNode } from "remix/component";

import { setPasswordSchema } from "@remix-v3-demo/domain/auth/auth-validator";
import { setPassword } from "@remix-v3-demo/domain/auth/set-password";
import { verifyInvite } from "@remix-v3-demo/domain/auth/verify-invite";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { PageContext } from "../../../middleware/require-staff.ts";

import { supabaseSession } from "../../../middleware/supabase-session.ts";
import { routes } from "../../../routes.ts";
import { getFieldErrors } from "../../../ui/form/get-field-errors.ts";
import { readText } from "../../../ui/form/read-text.ts";
import { renderAuthPage } from "../render-admin-page.tsx";
import { InvalidInvite } from "./invalid-invite.tsx";
import { SetPasswordForm } from "./set-password-form.tsx";

function renderAcceptInvite(
  context: PageContext,
  page: RemixNode,
  status = 200,
) {
  return renderAuthPage(context, {
    title: "Invitation",
    heading: "Choisir votre mot de passe",
    page,
    status,
  });
}

export default createController(routes.admin.acceptInvite, {
  middleware: [supabaseSession()],
  actions: {
    async index(context) {
      let tokenHash = context.url.searchParams.get("token_hash");
      let isVerified =
        tokenHash !== null &&
        (await verifyInvite(context.supabase, tokenHash).then(
          () => true,
          () => false,
        ));
      return renderAcceptInvite(
        context,
        isVerified ? <SetPasswordForm /> : <InvalidInvite />,
      );
    },
    async action(context) {
      let parsed = s.parseSafe(setPasswordSchema, {
        password: readText(context.formData, "password"),
      });
      if (!parsed.success) {
        return renderAcceptInvite(
          context,
          <SetPasswordForm
            passwordError={getFieldErrors(parsed.issues).password}
          />,
          400,
        );
      }
      try {
        await setPassword(context.supabase, parsed.value.password);
      } catch {
        return renderAcceptInvite(
          context,
          <SetPasswordForm error="Le mot de passe n'a pas pu être enregistré" />,
          400,
        );
      }
      return redirect(routes.admin.listings.index.href(), 303);
    },
  },
});
