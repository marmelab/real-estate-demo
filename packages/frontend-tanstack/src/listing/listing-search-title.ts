import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

export function getListingSearchTitle({
  transactionType,
  city,
}: Pick<ListListingsQuery, "transactionType" | "city">): string {
  const title =
    transactionType === "rent" ? "Homes for rent" : "Homes for sale";
  return city ? `${title} in ${city}` : title;
}
