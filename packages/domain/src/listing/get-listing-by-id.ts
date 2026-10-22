import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { Listing } from "./model.ts";

import { getListingImage, listingImageRowSchema } from "./get-listing-image.ts";
import { listingSchema } from "./model.ts";

const listingRowSchema = listingSchema.extend({
  images: z.array(listingImageRowSchema),
});

export async function getListingById(
  client: SupabaseClient,
  id: number,
): Promise<Listing | null> {
  const { data, error } = await client
    .from("listing")
    .select(
      "id, title, description, price, transactionType:transaction_type, propertyType:property_type, surfaceArea:surface_area, landArea:land_area, rooms, bedrooms, energyClass:energy_class, address, city, postalCode:postal_code, images:listing_image(path, alt), agent(firstName:first_name, lastName:last_name)",
    )
    .eq("id", id)
    .eq("published", true)
    .order("position", { referencedTable: "images" })
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const listing = listingRowSchema.parse(data);
  return {
    ...listing,
    images: listing.images.map((image) => getListingImage(client, image)),
  };
}
