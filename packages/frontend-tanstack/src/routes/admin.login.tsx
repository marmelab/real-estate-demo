import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { AuthPage } from "../auth/auth-page.tsx";
import { getStaffOrNull } from "../auth/get-staff-or-null.ts";
import { useSignIn } from "../auth/hook/sign-in.ts";
import { NOINDEX_META } from "../auth/noindex.ts";
import { SignInForm } from "../auth/sign-in-form.tsx";

const DEFAULT_REDIRECT = "/admin/listings";

export const Route = createFileRoute("/admin/login")({
  validateSearch: z.object({
    redirect: z
      .string()
      .regex(/^\/admin(?:[/?#]|$)/)
      .default(DEFAULT_REDIRECT)
      .catch(DEFAULT_REDIRECT),
  }),
  beforeLoad: async ({ context, search }) => {
    if (await getStaffOrNull(context.queryClient)) {
      throw redirect({ href: search.redirect });
    }
  },
  head: () => ({
    meta: [{ title: "Connexion | Keyhaven" }, NOINDEX_META],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const router = useRouter();
  const { mutateAsync: signIn } = useSignIn();

  return (
    <AuthPage title="Connexion">
      <SignInForm
        onSubmit={async (credentials) => {
          await signIn(credentials);
          await router.navigate({ href: redirectTo });
        }}
      />
    </AuthPage>
  );
}
