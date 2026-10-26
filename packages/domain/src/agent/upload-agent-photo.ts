import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import {
  getImagePath,
  IMMUTABLE_CACHE_SECONDS,
} from "../listing-image/get-image-path.ts";

export async function uploadAgentPhoto(
  client: SupabaseClient,
  agentId: string,
  file: File,
): Promise<void> {
  const { data, error } = await client
    .from("agent")
    .select("photo_path")
    .eq("id", agentId)
    .single();
  if (error) throw error;
  const previous = z
    .object({ photo_path: z.string().nullable() })
    .parse(data).photo_path;

  const bucket = client.storage.from("agent-photo");
  const path = getImagePath(agentId, file);
  const { error: uploadError } = await bucket.upload(path, file, {
    contentType: file.type,
    cacheControl: IMMUTABLE_CACHE_SECONDS,
  });
  if (uploadError) throw uploadError;

  const { error: updateError } = await client
    .from("agent")
    .update({ photo_path: path })
    .eq("id", agentId);
  if (updateError) throw updateError;

  if (!previous) return;
  const { error: removeError } = await bucket.remove([previous]);
  if (removeError) throw removeError;
}
