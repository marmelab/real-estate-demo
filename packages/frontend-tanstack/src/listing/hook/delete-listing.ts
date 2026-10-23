import type { UseMutationResult } from "@tanstack/react-query";

import { deleteListing } from "@remix-v3-demo/domain/listing/delete-listing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { rethrowInsufficientPrivilege } from "../../supabase/insufficient-privilege.ts";
import { createSessionClient } from "../../supabase/session-client.ts";
import { invalidateListingQueries } from "./invalidate-listing-queries.ts";

const deleteListingFn = createServerFn({ method: "POST" })
  .validator(z.number().int().positive())
  .handler(({ data }) =>
    deleteListing(createSessionClient(), data).catch(
      rethrowInsufficientPrivilege,
    ),
  );

export function useDeleteListing(
  id: number,
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteListingFn({ data: id }),
    onSuccess: () => invalidateListingQueries(queryClient, id),
  });
}
