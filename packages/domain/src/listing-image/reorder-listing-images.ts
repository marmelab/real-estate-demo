import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

export async function reorderListingImages(
  client: SupabaseClient,
  listingId: number,
  orderedIds: number[],
): Promise<void> {
  const { data, error } = await client
    .from("listing_image")
    .select("id, path")
    .eq("listing_id", listingId);
  if (error) throw error;

  const paths = new Map(
    z
      .array(z.object({ id: z.number(), path: z.string() }))
      .parse(data)
      .map((image) => [image.id, image.path]),
  );
  const { error: upsertError } = await client.from("listing_image").upsert(
    orderedIds.map((id, position) => ({
      id,
      listing_id: listingId,
      path: paths.get(id),
      position,
    })),
    { onConflict: "id" },
  );
  if (upsertError) throw upsertError;
}
