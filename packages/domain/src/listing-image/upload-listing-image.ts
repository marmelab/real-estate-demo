import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ResizedListingImage } from "./resize-listing-image.ts";

import {
  getImagePath,
  getMobileImagePath,
  IMMUTABLE_CACHE_SECONDS,
} from "./get-image-path.ts";

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
  { desktop, mobile }: ResizedListingImage,
): Promise<void> {
  const bucket = client.storage.from("listing-image");
  const path = getImagePath(listingId, desktop);
  const mobilePath = getMobileImagePath(path);
  const upload = async (filePath: string, file: File) => {
    const { error } = await bucket.upload(filePath, file, {
      contentType: file.type,
      cacheControl: IMMUTABLE_CACHE_SECONDS,
    });
    if (error) throw error;
  };

  try {
    await Promise.all([upload(path, desktop), upload(mobilePath, mobile)]);
    await insertImageRow(client, listingId, path);
  } catch (error) {
    await bucket.remove([path, mobilePath]);
    throw error;
  }
}
