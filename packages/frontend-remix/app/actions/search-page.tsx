import type { ListingSearchResult } from "@remix-v3-demo/domain/listing/list-listings";
import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { Handle } from "remix/component";

import { getListingSearchTitle } from "@remix-v3-demo/domain/listing/get-listing-search-title";

import { Breadcrumb } from "../ui/breadcrumb.tsx";
import { ListingList } from "../ui/listing-list.tsx";
import { SearchFacets } from "../ui/search-facets.tsx";

export function SearchPage(
  handle: Handle<{ query: ListListingsQuery; result: ListingSearchResult }>,
) {
  return () => {
    let { query, result } = handle.props;

    return (
      <div class="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
        <Breadcrumb current="Recherche" />
        <h1 class="sr-only">{getListingSearchTitle(query)}</h1>
        <div class="grid gap-8 lg:grid-cols-3 lg:items-start">
          <aside aria-label="Filtres">
            <SearchFacets query={query} />
          </aside>
          <div class="lg:col-span-2">
            <ListingList result={result} query={query} />
          </div>
        </div>
      </div>
    );
  };
}
