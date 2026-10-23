import type { SupabaseClient } from "@supabase/supabase-js";

export async function updateListingImage(
  client: SupabaseClient,
  id: number,
  { alt }: { alt: string },
): Promise<void> {
  const { error } = await client
    .from("listing_image")
    .update({ alt })
    .eq("id", id);
  if (error) throw error;
}
