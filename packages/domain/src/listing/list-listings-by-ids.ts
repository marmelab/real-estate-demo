import type { SupabaseClient } from "@supabase/supabase-js";

import type { ListingSummary } from "./model.ts";

import {
  LISTING_SUMMARY_COLUMNS,
  toListingSummaries,
} from "./list-listings.ts";

export async function listListingsByIds(
  client: SupabaseClient,
  ids: number[],
): Promise<ListingSummary[]> {
  if (ids.length === 0) return [];

  const { data, error } = await client
    .from("listing")
    .select(LISTING_SUMMARY_COLUMNS)
    .in("id", ids)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .order("position", { referencedTable: "images" })
    .limit(1, { referencedTable: "images" });
  if (error) throw error;

  return toListingSummaries(client, data);
}
