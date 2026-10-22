import type { ListingSearchResult } from "@remix-v3-demo/domain/listing/list-listings";
import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { Handle } from "remix/component";

import { LISTING_PAGE_SIZE } from "@remix-v3-demo/domain/listing/list-listings";

import { ListingCard } from "./listing-card.tsx";
import { searchHref } from "./search-href.ts";

export function ListingList(
  handle: Handle<{
    result: ListingSearchResult;
    query: ListListingsQuery;
    isFullWidth?: boolean;
  }>,
) {
  return () => {
    let { result, query, isFullWidth = false } = handle.props;
    let hasNextPage = query.page * LISTING_PAGE_SIZE < result.total;

    return (
      <section aria-label="Résultats de recherche" class="space-y-8">
        <p class="eyebrow border-gold bg-obsidian-800 inline-block border px-3 py-2">
          {result.total}{" "}
          {result.total <= 1
            ? "résidence d'exception"
            : "résidences d'exception"}
        </p>
        {result.listings.length === 0 ? (
          <div class="space-y-3 py-20 text-center">
            <h2 class="text-2xl font-light text-white">
              Aucune résidence ne correspond
            </h2>
            <p class="mx-auto max-w-md text-sm text-gray-400">
              Élargissez votre budget ou retirez un filtre pour découvrir
              d'autres résidences.
            </p>
          </div>
        ) : (
          <ul
            class={`grid grid-cols-1 gap-8 md:grid-cols-2 ${isFullWidth ? "xl:grid-cols-3" : ""}`}
          >
            {result.listings.map((listing) => (
              <li key={listing.id} class="flex">
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
        {(query.page > 1 || hasNextPage) && (
          <nav aria-label="Pagination" class="flex justify-between gap-4">
            {query.page > 1 ? (
              <a
                href={searchHref({ ...query, page: query.page - 1 })}
                class="button-outline"
              >
                Précédent
              </a>
            ) : (
              <span />
            )}
            {hasNextPage && (
              <a
                href={searchHref({ ...query, page: query.page + 1 })}
                class="button-outline"
              >
                Suivant
              </a>
            )}
          </nav>
        )}
      </section>
    );
  };
}
