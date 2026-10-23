import type { ListingInput } from "@remix-v3-demo/domain/listing/listing-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { listingInputSchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { updateListing } from "@remix-v3-demo/domain/listing/update-listing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { rethrowInsufficientPrivilege } from "../../supabase/insufficient-privilege.ts";
import { createSessionClient } from "../../supabase/session-client.ts";
import { invalidateListingQueries } from "./invalidate-listing-queries.ts";

const updateListingFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ id: z.number().int().positive(), input: listingInputSchema }),
  )
  .handler(({ data }) =>
    updateListing(createSessionClient(), data.id, data.input).catch(
      rethrowInsufficientPrivilege,
    ),
  );

export function useUpdateListing(
  id: number,
): UseMutationResult<void, Error, ListingInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) =>
      updateListingFn({ data: { id, input } }),
    onSuccess: () => invalidateListingQueries(queryClient, id),
  });
}
