import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { AdminListing } from "./model.ts";

import { getListingImage } from "./get-listing-image.ts";
import { adminListingImageSchema, adminListingSchema } from "./model.ts";

const adminListingRowSchema = adminListingSchema.extend({
  images: z.array(adminListingImageSchema.omit({ url: true })),
});

export async function getAdminListingById(
  client: SupabaseClient,
  id: number,
): Promise<AdminListing | null> {
  const { data, error } = await client
    .from("listing")
    .select(
      "id, title, description, price, propertyType:property_type, surfaceArea:surface_area, landArea:land_area, rooms, bedrooms, energyClass:energy_class, address, postalCode:postal_code, city, latitude, longitude, published, agentId:agent_id, createdAt:created_at, images:listing_image(id, path, position, alt)",
    )
    .eq("id", id)
    .order("position", { referencedTable: "images" })
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const listing = adminListingRowSchema.parse(data);
  return {
    ...listing,
    images: listing.images.map((image) => ({
      ...image,
      url: getListingImage(client, image).url,
    })),
  };
}
