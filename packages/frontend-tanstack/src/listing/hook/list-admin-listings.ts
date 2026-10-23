import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListingSummary } from "@remix-v3-demo/domain/listing/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { listAdminListings } from "@remix-v3-demo/domain/listing/list-admin-listings";
import { listAdminListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";

const listAdminListingsFn = createServerFn({ method: "GET" })
  .validator(listAdminListingsQuerySchema)
  .handler(({ data }) => listAdminListings(createSessionClient(), data));

export function listAdminListingsQueryOptions(query: ListAdminListingsQuery) {
  return queryOptions({
    queryKey: ["admin", "listings", query],
    queryFn: () => listAdminListingsFn({ data: query }),
  });
}

export function useListAdminListings(
  query: ListAdminListingsQuery,
): UseSuspenseQueryResult<{ listings: AdminListingSummary[]; total: number }> {
  return useSuspenseQuery(listAdminListingsQueryOptions(query));
}
