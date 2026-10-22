import type { Listing } from "@remix-v3-demo/domain/listing/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { getListingById } from "@remix-v3-demo/domain/listing/get-listing-by-id";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createServerClient } from "../../supabase/server-client.ts";

const getListingByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(({ data }) => getListingById(createServerClient(), data));

export function getListingByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["listing", id],
    queryFn: () => getListingByIdFn({ data: id }),
  });
}

export function useGetListingById(
  id: number,
): UseSuspenseQueryResult<Listing | null> {
  return useSuspenseQuery(getListingByIdQueryOptions(id));
}
