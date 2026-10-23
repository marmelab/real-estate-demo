import type { Handle } from "remix/component";

import { routes } from "../routes.ts";
import { Logo } from "./logo.tsx";

export function SiteHeader(_handle: Handle) {
  return () => (
    <header class="border-obsidian-600 bg-obsidian-900 border-b">
      <div class="mx-auto flex h-20 max-w-7xl items-center px-4">
        <a
          href={routes.home.href()}
          class="group focus-visible:outline-gold flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span class="border-gold bg-obsidian-800 text-gold flex size-10 items-center justify-center border">
            <Logo class="size-7" />
          </span>
          <span class="flex flex-col">
            <span class="group-hover:text-gold text-xl font-light tracking-[0.3em] text-white uppercase transition-colors">
              Keyhaven
            </span>
            <span class="text-gold text-[10px] tracking-[0.35em] uppercase">
              Résidences de prestige
            </span>
          </span>
        </a>
      </div>
    </header>
  );
}
