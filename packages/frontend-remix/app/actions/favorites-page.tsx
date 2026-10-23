import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { routes } from "../routes.ts";
import { Breadcrumb } from "../ui/breadcrumb.tsx";
import { ListingCard } from "../ui/listing-card.tsx";

export function FavoritesPage(handle: Handle<{ listings: ListingSummary[] }>) {
  return () => {
    let { listings } = handle.props;

    return (
      <div class="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
        <Breadcrumb current="Favoris" />
        <h1 class="text-3xl font-light tracking-tight text-white sm:text-5xl">
          Vos <span class="text-gold italic">favoris</span>
        </h1>
        {listings.length === 0 ? (
          <div class="space-y-4 py-20 text-center">
            <p class="text-gray-300">
              Ajoutez une résidence à vos favoris pour la retrouver ici.
            </p>
            <a href={routes.home.href()} class="button-gold">
              Découvrir nos résidences
            </a>
          </div>
        ) : (
          <ul class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <li key={listing.id} class="flex">
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}
