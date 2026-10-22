import type { ListListingsQuery } from "./listing-validator.ts";

export function getListingSearchTitle({
  city,
}: Pick<ListListingsQuery, "city">): string {
  return city ? `Biens de prestige à ${city}` : "Biens de prestige";
}
