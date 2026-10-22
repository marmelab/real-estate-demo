import { z } from "zod";

export const propertyTypeSchema = z.enum(["house", "apartment"]);
export type PropertyType = z.infer<typeof propertyTypeSchema>;

export const energyClassSchema = z.enum(["A", "B", "C", "D", "E", "F", "G"]);
export type EnergyClass = z.infer<typeof energyClassSchema>;

export const listingImageSchema = z.object({
  url: z.string(),
  alt: z.string(),
});
export type ListingImage = z.infer<typeof listingImageSchema>;

export const listingSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  propertyType: propertyTypeSchema,
  surfaceArea: z.number().nullable(),
  rooms: z.number().nullable(),
  bedrooms: z.number().nullable(),
  city: z.string(),
  postalCode: z.string(),
  image: listingImageSchema.nullable(),
});
export type ListingSummary = z.infer<typeof listingSummarySchema>;

export const listingSchema = listingSummarySchema.omit({ image: true }).extend({
  description: z.string(),
  landArea: z.number().nullable(),
  energyClass: energyClassSchema.nullable(),
  address: z.string(),
  images: z.array(listingImageSchema),
  agent: z.object({ firstName: z.string(), lastName: z.string() }).nullable(),
});
export type Listing = z.infer<typeof listingSchema>;
