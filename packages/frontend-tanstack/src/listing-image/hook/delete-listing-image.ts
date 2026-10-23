import type { UseMutationResult } from "@tanstack/react-query";

import { deleteListingImage } from "@remix-v3-demo/domain/listing-image/delete-listing-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { invalidateListingQueries } from "../../listing/hook/invalidate-listing-queries.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const deleteListingImageFn = createServerFn({ method: "POST" })
  .validator(z.number().int().positive())
  .handler(({ data }) => deleteListingImage(createSessionClient(), data));

export function useDeleteListingImage(
  listingId: number,
): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteListingImageFn({ data: id }),
    onSuccess: () => invalidateListingQueries(queryClient, listingId),
  });
}
