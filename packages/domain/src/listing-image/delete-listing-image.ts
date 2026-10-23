import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

export async function deleteListingImage(
  client: SupabaseClient,
  id: number,
): Promise<void> {
  const { data, error } = await client
    .from("listing_image")
    .delete()
    .eq("id", id)
    .select("path")
    .single();
  if (error) throw error;

  const { path } = z.object({ path: z.string() }).parse(data);
  const { error: removeError } = await client.storage
    .from("listing-image")
    .remove([path]);
  if (removeError) throw removeError;
}
