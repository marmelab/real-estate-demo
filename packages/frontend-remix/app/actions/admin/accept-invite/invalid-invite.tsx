import type { Handle } from "remix/component";

import { routes } from "../../../routes.ts";

export function InvalidInvite(_handle: Handle) {
  return () => (
    <div class="space-y-6">
      <p role="alert" class="text-gray-300">
        Ce lien d'invitation est invalide, expiré ou a déjà été utilisé.
      </p>
      <a href={routes.admin.login.index.href()} class="button-gold">
        Se connecter
      </a>
    </div>
  );
}
