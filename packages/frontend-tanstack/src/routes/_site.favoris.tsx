import { Link, createFileRoute } from "@tanstack/react-router";

import { readRequestFavoriteIds } from "../favorite/read-request-favorite-ids.ts";
import { Breadcrumb } from "../listing/breadcrumb.tsx";
import {
  listListingsByIdsQueryOptions,
  useListListingsByIds,
} from "../listing/hook/list-listings-by-ids.ts";
import { ListingCard } from "../listing/listing-card.tsx";

export const Route = createFileRoute("/_site/favoris")({
  loader: async ({ context }) => {
    const ids = readRequestFavoriteIds();
    await context.queryClient.ensureQueryData(
      listListingsByIdsQueryOptions(ids),
    );
    return ids;
  },
  head: () => ({
    meta: [
      { title: "Vos favoris | Keyhaven" },
      {
        name: "description",
        content: "Les résidences d'exception que vous avez retenues.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const ids = Route.useLoaderData();
  const { data: listings } = useListListingsByIds(ids);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
      <Breadcrumb current="Favoris" />
      <h1 className="text-3xl font-light tracking-tight text-white sm:text-5xl">
        Vos <span className="text-gold italic">favoris</span>
      </h1>
      {listings.length === 0 ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-gray-300">
            Ajoutez une résidence à vos favoris pour la retrouver ici.
          </p>
          <Link to="/" className="button-gold">
            Découvrir nos résidences
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => (
            <li key={listing.id} className="flex">
              <ListingCard listing={listing} isPriority={index === 0} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
