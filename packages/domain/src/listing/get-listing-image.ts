import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListingImage } from "./model.ts";

import { getMobileImagePath } from "../listing-image/get-image-path.ts";

export const listingImageRowSchema = z.object({
  path: z.string(),
  alt: z.string(),
});

export function getListingImage(
  client: SupabaseClient,
  { path, alt }: z.infer<typeof listingImageRowSchema>,
): ListingImage {
  const bucket = client.storage.from("listing-image");
  return {
    url: bucket.getPublicUrl(path).data.publicUrl,
    mobileUrl: bucket.getPublicUrl(getMobileImagePath(path)).data.publicUrl,
    alt,
  };
}
