import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

export function getListingSearchTitle({
  city,
}: Pick<ListListingsQuery, "city">): string {
  return city ? `Biens de prestige à ${city}` : "Biens de prestige";
}
