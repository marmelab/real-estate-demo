import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import { LISTING_PAGE_SIZE } from "@remix-v3-demo/domain/listing/list-listings";
import { Link } from "@tanstack/react-router";

import { ListingCard } from "./listing-card.tsx";

export function ListingList({
  listings,
  total,
  search,
  isFullWidth = false,
}: {
  listings: ListingSummary[];
  total: number;
  search: ListListingsQuery;
  isFullWidth?: boolean;
}) {
  const hasNextPage = search.page * LISTING_PAGE_SIZE < total;

  return (
    <section aria-label="Résultats de recherche" className="space-y-8">
      <p className="eyebrow border-gold bg-obsidian-800 inline-block border px-3 py-2">
        {total}{" "}
        {total <= 1 ? "résidence d'exception" : "résidences d'exception"}
      </p>
      {listings.length === 0 ? (
        <div className="space-y-3 py-20 text-center">
          <h2 className="text-2xl font-light text-white">
            Aucune résidence ne correspond
          </h2>
          <p className="mx-auto max-w-md text-sm text-gray-400">
            Élargissez votre budget ou retirez un filtre pour découvrir d'autres
            résidences.
          </p>
        </div>
      ) : (
        <ul
          className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${isFullWidth ? "xl:grid-cols-3" : ""}`}
        >
          {listings.map((listing) => (
            <li key={listing.id} className="flex">
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
      {(search.page > 1 || hasNextPage) && (
        <nav aria-label="Pagination" className="flex justify-between gap-4">
          {search.page > 1 ? (
            <Link
              to="/search"
              search={{ ...search, page: search.page - 1 }}
              className="button-outline"
            >
              Précédent
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage && (
            <Link
              to="/search"
              search={{ ...search, page: search.page + 1 }}
              className="button-outline"
            >
              Suivant
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
