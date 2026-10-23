import type { AdminListing } from "@remix-v3-demo/domain/listing/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { getAdminListingById } from "@remix-v3-demo/domain/listing/get-admin-listing-by-id";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createSessionClient } from "../../supabase/session-client.ts";

const getAdminListingByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(({ data }) => getAdminListingById(createSessionClient(), data));

export function getAdminListingByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["admin", "listing", id],
    queryFn: () => getAdminListingByIdFn({ data: id }),
  });
}

export function useGetAdminListingById(
  id: number,
): UseSuspenseQueryResult<AdminListing | null> {
  return useSuspenseQuery(getAdminListingByIdQueryOptions(id));
}
