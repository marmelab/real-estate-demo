import type { UseMutationResult } from "@tanstack/react-query";

import { listingImageAltSchema } from "@remix-v3-demo/domain/listing-image/listing-image-validator";
import { updateListingImage } from "@remix-v3-demo/domain/listing-image/update-listing-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { invalidateListingQueries } from "../../listing/hook/invalidate-listing-queries.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const updateListingImageFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ id: z.number().int().positive(), alt: listingImageAltSchema }),
  )
  .handler(({ data }) =>
    updateListingImage(createSessionClient(), data.id, { alt: data.alt }),
  );

export function useUpdateListingImage(
  listingId: number,
): UseMutationResult<void, Error, { id: number; alt: string }> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: { id: number; alt: string }) =>
      updateListingImageFn({ data: image }),
    onSuccess: () => invalidateListingQueries(queryClient, listingId),
  });
}
