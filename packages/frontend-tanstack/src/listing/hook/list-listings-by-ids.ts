import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { listListingsByIds } from "@remix-v3-demo/domain/listing/list-listings-by-ids";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createServerClient } from "../../supabase/server-client.ts";

const listListingsByIdsFn = createServerFn({ method: "GET" })
  .validator(z.array(z.number().int().positive()))
  .handler(({ data }) => listListingsByIds(createServerClient(), data));

export function listListingsByIdsQueryOptions(ids: number[]) {
  return queryOptions({
    queryKey: ["listings", "by-ids", ids],
    queryFn: () => listListingsByIdsFn({ data: ids }),
  });
}

export function useListListingsByIds(
  ids: number[],
): UseSuspenseQueryResult<ListingSummary[]> {
  return useSuspenseQuery(listListingsByIdsQueryOptions(ids));
}
