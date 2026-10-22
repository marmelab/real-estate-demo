import type { Listing } from "./model.ts";

export function formatAddress({
  address,
  postalCode,
  city,
}: Pick<Listing, "address" | "postalCode" | "city">): string {
  return [address, `${postalCode} ${city}`].filter(Boolean).join(", ");
}
