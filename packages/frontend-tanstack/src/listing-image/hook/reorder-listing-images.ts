import type { UseMutationResult } from "@tanstack/react-query";

import { reorderListingImages } from "@remix-v3-demo/domain/listing-image/reorder-listing-images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { invalidateListingQueries } from "../../listing/hook/invalidate-listing-queries.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const idSchema = z.number().int().positive();

const reorderListingImagesFn = createServerFn({ method: "POST" })
  .validator(z.object({ listingId: idSchema, orderedIds: z.array(idSchema) }))
  .handler(({ data }) =>
    reorderListingImages(
      createSessionClient(),
      data.listingId,
      data.orderedIds,
    ),
  );

export function useReorderListingImages(
  listingId: number,
): UseMutationResult<void, Error, number[]> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: number[]) =>
      reorderListingImagesFn({ data: { listingId, orderedIds } }),
    onSuccess: () => invalidateListingQueries(queryClient, listingId),
  });
}
