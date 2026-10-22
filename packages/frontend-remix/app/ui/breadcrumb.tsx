import type { Handle } from "remix/component";

import { routes } from "../routes.ts";

export function Breadcrumb(handle: Handle<{ current: string }>) {
  return () => (
    <nav
      aria-label="Fil d'Ariane"
      class="border-obsidian-700 flex items-center gap-2 border-b pb-6 text-xs tracking-widest text-gray-400 uppercase"
    >
      <a
        href={routes.home.href()}
        class="hover:text-gold focus-visible:outline-gold focus-visible:outline-2"
      >
        Accueil
      </a>
      <span aria-hidden="true">/</span>
      <span aria-current="page" class="text-gold">
        {handle.props.current}
      </span>
    </nav>
  );
}
