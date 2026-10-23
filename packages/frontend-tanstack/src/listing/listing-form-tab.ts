import { z } from "zod";

export const listingFormTabSchema = z
  .enum(["general", "details", "location", "photos"])
  .catch("general");
export type ListingFormTab = z.infer<typeof listingFormTabSchema>;

export const listingFormSearchSchema = z.object({
  tab: listingFormTabSchema.default("general"),
});
