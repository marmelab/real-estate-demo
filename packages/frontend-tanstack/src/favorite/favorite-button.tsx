import { toggleFavorite } from "@remix-v3-demo/domain/favorite/favorite-store";
import { Heart } from "lucide-react";

import { useFavoriteIds } from "./use-favorite-ids.ts";

export function FavoriteButton({
  listingId,
  className = "",
}: {
  listingId: number;
  className?: string;
}) {
  const isFavorite = useFavoriteIds().includes(listingId);

  return (
    <button
      type="button"
      aria-label="Ajouter aux favoris"
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(listingId)}
      className={`border-gold bg-obsidian-950/85 text-gold hover:bg-gold hover:text-obsidian-950 focus-visible:outline-gold flex size-11 cursor-pointer items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <Heart
        aria-hidden="true"
        className={`size-5 ${isFavorite ? "fill-current" : ""}`}
        strokeWidth={1.5}
      />
    </button>
  );
}
