import { signInSchema } from "@remix-v3-demo/domain/auth/auth-validator";
import { getCurrentStaff } from "@remix-v3-demo/domain/auth/get-current-staff";
import { signIn } from "@remix-v3-demo/domain/auth/sign-in";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { PageContext } from "../../../middleware/require-staff.ts";

import { supabaseSession } from "../../../middleware/supabase-session.ts";
import { routes } from "../../../routes.ts";
import { getFieldErrors } from "../../../ui/form/get-field-errors.ts";
import { readText } from "../../../ui/form/read-text.ts";
import { renderAuthPage } from "../render-admin-page.tsx";
import { SignInForm } from "./sign-in-form.tsx";

const DEFAULT_REDIRECT = routes.admin.listings.index.href();

const ADMIN_PATH = /^\/admin(?:[/?#]|$)/;

function getRedirect(context: { url: URL }): string {
  let target = context.url.searchParams.get("redirect") ?? "";
  return ADMIN_PATH.test(target) ? target : DEFAULT_REDIRECT;
}

function renderLogin(
  context: PageContext,
  form: { email?: string; errors?: Record<string, string>; error?: string },
  status = 200,
) {
  return renderAuthPage(context, {
    title: "Connexion",
    heading: "Connexion",
    status,
    page: (
      <SignInForm
        action={routes.admin.login.action.href(undefined, {
          searchParams: { redirect: getRedirect(context) },
        })}
        {...form}
      />
    ),
  });
}

export default createController(routes.admin.login, {
  middleware: [supabaseSession()],
  actions: {
    async index(context) {
      let staff = await getCurrentStaff(context.supabase).catch(() => null);
      if (staff) return redirect(getRedirect(context));
      return renderLogin(context, {});
    },
    async action(context) {
      let email = readText(context.formData, "email");
      let parsed = s.parseSafe(
        signInSchema,
        Object.fromEntries(context.formData),
      );
      if (!parsed.success) {
        return renderLogin(
          context,
          { email, errors: getFieldErrors(parsed.issues) },
          400,
        );
      }
      try {
        await signIn(context.supabase, parsed.value);
      } catch {
        return renderLogin(
          context,
          { email, error: "Identifiants invalides" },
          400,
        );
      }
      return redirect(getRedirect(context), 303);
    },
  },
});
