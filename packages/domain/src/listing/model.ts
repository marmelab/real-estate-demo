import { z } from "zod";

export const propertyTypeSchema = z.enum(["house", "apartment"]);
export type PropertyType = z.infer<typeof propertyTypeSchema>;

export const energyClassSchema = z.enum(["A", "B", "C", "D", "E", "F", "G"]);
export type EnergyClass = z.infer<typeof energyClassSchema>;

export const listingImageSchema = z.object({
  url: z.string(),
  mobileUrl: z.string(),
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

export const adminListingSummarySchema = listingSchema
  .pick({
    id: true,
    title: true,
    price: true,
    propertyType: true,
    city: true,
    postalCode: true,
    agent: true,
  })
  .extend({ published: z.boolean(), createdAt: z.string() });
export type AdminListingSummary = z.infer<typeof adminListingSummarySchema>;

export const adminListingImageSchema = z.object({
  id: z.number(),
  path: z.string(),
  position: z.number(),
  alt: z.string(),
  url: z.string(),
});
export type AdminListingImage = z.infer<typeof adminListingImageSchema>;

export const adminListingSchema = listingSchema
  .omit({ images: true, agent: true })
  .extend({
    latitude: z.number(),
    longitude: z.number(),
    published: z.boolean(),
    agentId: z.uuid().nullable(),
    createdAt: z.string(),
    images: z.array(adminListingImageSchema),
  });
export type AdminListing = z.infer<typeof adminListingSchema>;
