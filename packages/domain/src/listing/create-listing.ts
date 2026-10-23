import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListingInput } from "./listing-validator.ts";

import { toListingRow } from "./to-listing-row.ts";

export async function createListing(
  client: SupabaseClient,
  input: ListingInput,
): Promise<{ id: number }> {
  const { data, error } = await client
    .from("listing")
    .insert(toListingRow(input))
    .select("id")
    .single();
  if (error) throw error;
  return z.object({ id: z.number() }).parse(data);
}
