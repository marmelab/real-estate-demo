import type { UseMutationResult } from "@tanstack/react-query";

import { listingImageFileSchema } from "@remix-v3-demo/domain/listing-image/listing-image-validator";
import { resizeListingImage } from "@remix-v3-demo/domain/listing-image/resize-listing-image";
import { uploadListingImage } from "@remix-v3-demo/domain/listing-image/upload-listing-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { invalidateListingQueries } from "../../listing/hook/invalidate-listing-queries.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const uploadListingImageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return {
      listingId: z.coerce
        .number()
        .int()
        .positive()
        .parse(data.get("listingId")),
      images: {
        desktop: listingImageFileSchema.parse(data.get("desktop")),
        mobile: listingImageFileSchema.parse(data.get("mobile")),
      },
    };
  })
  .handler(({ data }) =>
    uploadListingImage(createSessionClient(), data.listingId, data.images),
  );

export function useUploadListingImage(
  listingId: number,
): UseMutationResult<void, Error, File> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const { desktop, mobile } = await resizeListingImage(file);
      const formData = new FormData();
      formData.set("listingId", String(listingId));
      formData.set("desktop", desktop);
      formData.set("mobile", mobile);
      return uploadListingImageFn({ data: formData });
    },
    onSuccess: () => invalidateListingQueries(queryClient, listingId),
  });
}
