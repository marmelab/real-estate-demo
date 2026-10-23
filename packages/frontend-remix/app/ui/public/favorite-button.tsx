import type { Handle, RemixNode } from "remix/component";

import {
  getFavoriteIds,
  subscribeToFavorites,
  toggleFavorite,
} from "@remix-v3-demo/domain/favorite/favorite-store";
import { clientEntry, on } from "remix/component";

export const FavoriteButton = clientEntry(
  import.meta.url,
  function FavoriteButton(
    handle: Handle<{
      listingId: number;
      isFavorite: boolean;
      class?: string;
      children?: RemixNode;
    }>,
  ) {
    let isFavorite = handle.props.isFavorite;
    handle.queueTask(() => {
      let unsubscribe = subscribeToFavorites(() => {
        isFavorite = getFavoriteIds().includes(handle.props.listingId);
        void handle.update();
      });
      handle.signal.addEventListener("abort", unsubscribe);
    });

    return () => (
      <button
        type="button"
        aria-label="Ajouter aux favoris"
        aria-pressed={isFavorite ? "true" : "false"}
        mix={on("click", () => toggleFavorite(handle.props.listingId))}
        class={`border-gold bg-obsidian-950/85 text-gold hover:bg-gold hover:text-obsidian-950 focus-visible:outline-gold flex size-11 cursor-pointer items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:*:fill-current ${handle.props.class ?? ""}`}
      >
        {handle.props.children}
      </button>
    );
  },
);
