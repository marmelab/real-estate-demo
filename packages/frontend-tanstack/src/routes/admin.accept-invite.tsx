import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import { AuthPage } from "../auth/auth-page.tsx";
import { useSetPassword } from "../auth/hook/set-password.ts";
import { verifyInviteFn } from "../auth/hook/verify-invite.ts";
import { InviteFromHash } from "../auth/invite-from-hash.tsx";
import { NOINDEX_META } from "../auth/noindex.ts";
import { SetPasswordForm } from "../auth/set-password-form.tsx";

export const Route = createFileRoute("/admin/accept-invite")({
  validateSearch: z.object({
    token_hash: z.string().optional().catch(undefined),
  }),
  loaderDeps: ({ search }) => ({ tokenHash: search.token_hash }),
  loader: ({ deps: { tokenHash } }) =>
    tokenHash
      ? verifyInviteFn({ data: tokenHash }).then(
          () => "verified" as const,
          () => "invalid" as const,
        )
      : ("fromHash" as const),
  shouldReload: false,
  head: () => ({
    meta: [{ title: "Invitation | Keyhaven" }, NOINDEX_META],
  }),
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const status = Route.useLoaderData();
  const router = useRouter();
  const { mutateAsync: setPassword } = useSetPassword();

  const form = (
    <SetPasswordForm
      onSubmit={async (input) => {
        await setPassword(input);
        await router.navigate({ to: "/admin/listings" });
      }}
    />
  );
  const invalid = (
    <div className="space-y-6">
      <p role="alert" className="text-gray-300">
        Ce lien d'invitation est invalide, expiré ou a déjà été utilisé.
      </p>
      <Link to="/admin/login" className="button-gold">
        Se connecter
      </Link>
    </div>
  );

  return (
    <AuthPage title="Choisir votre mot de passe">
      {status === "verified" && form}
      {status === "invalid" && invalid}
      {status === "fromHash" && (
        <InviteFromHash verified={form} invalid={invalid} />
      )}
    </AuthPage>
  );
}
