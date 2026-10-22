import type { Handle } from "remix/component";

import { routes } from "../routes.ts";

export function NotFoundPage(
  handle: Handle<{ title: string; message: string }>,
) {
  return () => (
    <div class="mx-auto w-full max-w-7xl space-y-4 px-4 py-20 text-center">
      <h1 class="text-3xl font-light text-white">{handle.props.title}</h1>
      <p class="text-gray-300">{handle.props.message}</p>
      <a href={routes.home.href()} class="button-gold">
        Retour à l'accueil
      </a>
    </div>
  );
}
