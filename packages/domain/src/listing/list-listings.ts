import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListListingsQuery } from "./listing-validator.ts";
import type { ListingSummary } from "./model.ts";

import { getListingImage, listingImageRowSchema } from "./get-listing-image.ts";
import { listingSummarySchema } from "./model.ts";

export const LISTING_PAGE_SIZE = 12;

const listingSummaryRowSchema = listingSummarySchema
  .omit({ image: true })
  .extend({ images: z.array(listingImageRowSchema) });

export type ListingSearchResult = {
  listings: ListingSummary[];
  total: number;
};

export async function listListings(
  client: SupabaseClient,
  query: ListListingsQuery,
): Promise<ListingSearchResult> {
  let request = client
    .from("listing")
    .select(
      "id, title, price, transactionType:transaction_type, propertyType:property_type, surfaceArea:surface_area, rooms, bedrooms, city, postalCode:postal_code, images:listing_image(path, alt)",
      { count: "exact" },
    )
    .eq("published", true)
    .eq("transaction_type", query.transactionType);
  if (query.city) request = request.ilike("city", `${query.city}%`);
  if (query.minPrice) request = request.gte("price", query.minPrice);
  if (query.maxPrice) request = request.lte("price", query.maxPrice);
  if (query.minRooms) request = request.gte("rooms", query.minRooms);
  if (query.minBedrooms) request = request.gte("bedrooms", query.minBedrooms);
  if (query.minSurface) request = request.gte("surface_area", query.minSurface);

  const from = (query.page - 1) * LISTING_PAGE_SIZE;
  const { data, count, error } = await request
    .order("created_at", { ascending: false })
    .order("position", { referencedTable: "images" })
    .limit(1, { referencedTable: "images" })
    .range(from, from + LISTING_PAGE_SIZE - 1);
  if (error) throw error;

  const rows = z.array(listingSummaryRowSchema).parse(data);
  return {
    listings: rows.map(({ images: [image], ...listing }) => ({
      ...listing,
      image: image ? getListingImage(client, image) : null,
    })),
    total: count ?? 0,
  };
}
