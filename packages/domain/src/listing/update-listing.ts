import type { SupabaseClient } from "@supabase/supabase-js";

import type { ListingInput } from "./listing-validator.ts";

import { toListingRow } from "./to-listing-row.ts";

export async function updateListing(
  client: SupabaseClient,
  id: number,
  input: ListingInput,
): Promise<void> {
  const { error } = await client
    .from("listing")
    .update(toListingRow(input))
    .eq("id", id);
  if (error) throw error;
}
