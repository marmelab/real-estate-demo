import type { ListingSearchResult } from "@remix-v3-demo/domain/listing/list-listings";
import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { listListings } from "@remix-v3-demo/domain/listing/list-listings";
import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createServerClient } from "../../supabase/server-client.ts";

const listListingsFn = createServerFn({ method: "GET" })
  .validator(listListingsQuerySchema)
  .handler(({ data }) => listListings(createServerClient(), data));

export function listListingsQueryOptions(query: ListListingsQuery) {
  return queryOptions({
    queryKey: ["listings", query],
    queryFn: () => listListingsFn({ data: query }),
  });
}

export function useListListings(
  query: ListListingsQuery,
): UseSuspenseQueryResult<ListingSearchResult> {
  return useSuspenseQuery(listListingsQueryOptions(query));
}
