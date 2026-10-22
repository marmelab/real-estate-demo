import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListingImage } from "./model.ts";

export const listingImageRowSchema = z.object({
  path: z.string(),
  alt: z.string(),
});

export function getListingImage(
  client: SupabaseClient,
  { path, alt }: z.infer<typeof listingImageRowSchema>,
): ListingImage {
  const { publicUrl } = client.storage
    .from("listing-image")
    .getPublicUrl(path).data;
  return { url: publicUrl, alt };
}
