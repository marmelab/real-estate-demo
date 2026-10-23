import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import { getImagePath } from "./get-image-path.ts";

async function insertImageRow(
  client: SupabaseClient,
  listingId: number,
  path: string,
): Promise<void> {
  const { data, error } = await client
    .from("listing_image")
    .select("position")
    .eq("listing_id", listingId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const last = z.object({ position: z.number() }).nullable().parse(data);
  const { error: insertError } = await client.from("listing_image").insert({
    listing_id: listingId,
    path,
    position: last ? last.position + 1 : 0,
  });
  if (insertError) throw insertError;
}

export async function uploadListingImage(
  client: SupabaseClient,
  listingId: number,
  file: File,
): Promise<void> {
  const bucket = client.storage.from("listing-image");
  const path = getImagePath(listingId, file);
  const { error } = await bucket.upload(path, file, { contentType: file.type });
  if (error) throw error;

  try {
    await insertImageRow(client, listingId, path);
  } catch (insertError) {
    await bucket.remove([path]);
    throw insertError;
  }
}
