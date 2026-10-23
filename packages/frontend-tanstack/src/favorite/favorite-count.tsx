import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { useFavoriteIds } from "./use-favorite-ids.ts";

export function FavoriteCount() {
  const count = useFavoriteIds().length;

  return (
    <Link
      to="/favoris"
      className="eyebrow hover:text-gold-light focus-visible:outline-gold ml-auto flex min-h-11 items-center gap-2 focus-visible:outline-2"
    >
      <Heart aria-hidden="true" className="size-4" />
      <span className="max-sm:sr-only">Favoris</span>
      <span className="border-gold min-w-6 border px-1.5 py-0.5 text-center">
        {count}
      </span>
    </Link>
  );
}
