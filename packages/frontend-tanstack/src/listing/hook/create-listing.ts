import type { ListingInput } from "@remix-v3-demo/domain/listing/listing-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { createListing } from "@remix-v3-demo/domain/listing/create-listing";
import { listingInputSchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { rethrowInsufficientPrivilege } from "../../supabase/insufficient-privilege.ts";
import { createSessionClient } from "../../supabase/session-client.ts";
import { invalidateListingQueries } from "./invalidate-listing-queries.ts";

const createListingFn = createServerFn({ method: "POST" })
  .validator(listingInputSchema)
  .handler(({ data }) =>
    createListing(createSessionClient(), data).catch(
      rethrowInsufficientPrivilege,
    ),
  );

export function useCreateListing(): UseMutationResult<
  { id: number },
  Error,
  ListingInput
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ListingInput) => createListingFn({ data: input }),
    onSuccess: () => invalidateListingQueries(queryClient),
  });
}
