import type { Handle, RemixNode } from "remix/component";

import {
  getFavoriteIds,
  subscribeToFavorites,
} from "@remix-v3-demo/domain/favorite/favorite-store";
import { clientEntry } from "remix/component";

import { routes } from "../../routes.ts";

export const FavoriteCount = clientEntry(
  import.meta.url,
  function FavoriteCount(
    handle: Handle<{ count: number; children?: RemixNode }>,
  ) {
    let count = handle.props.count;
    handle.queueTask(() => {
      let unsubscribe = subscribeToFavorites(() => {
        count = getFavoriteIds().length;
        void handle.update();
      });
      handle.signal.addEventListener("abort", unsubscribe);
    });

    return () => (
      <a
        href={routes.favorites.href()}
        class="eyebrow hover:text-gold-light focus-visible:outline-gold ml-auto flex min-h-11 items-center gap-2 focus-visible:outline-2"
      >
        {handle.props.children}
        <span class="max-sm:sr-only">Favoris</span>
        <span class="border-gold min-w-6 border px-1.5 py-0.5 text-center">
          {count}
        </span>
      </a>
    );
  },
);
