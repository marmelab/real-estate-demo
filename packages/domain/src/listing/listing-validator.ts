import { z } from "zod";

import { energyClassSchema, propertyTypeSchema } from "./model.ts";
import { TARGET_CITIES } from "./target-cities.ts";

const positiveIntSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .catch(undefined);

const searchTextSchema = z
  .string()
  .trim()
  .transform((text) => text || undefined)
  .optional()
  .catch(undefined);

const pageSchema = z.coerce.number().int().min(1).default(1).catch(1);

const cityNameSchema = z.enum(TARGET_CITIES.map((city) => city.name));

export const listListingsQuerySchema = z.object({
  city: searchTextSchema,
  propertyType: propertyTypeSchema.optional().catch(undefined),
  minPrice: positiveIntSchema,
  maxPrice: positiveIntSchema,
  minRooms: positiveIntSchema,
  minBedrooms: positiveIntSchema,
  minSurface: positiveIntSchema,
  maxSurface: positiveIntSchema,
  energyClasses: z
    .preprocess(
      (value) => (typeof value === "string" ? value.split(",") : value),
      z.array(energyClassSchema).nonempty(),
    )
    .optional()
    .catch(undefined),
  page: pageSchema,
});
export type ListListingsQuery = z.infer<typeof listListingsQuerySchema>;

export const listAdminListingsQuerySchema = z.object({
  q: searchTextSchema,
  city: cityNameSchema.optional().catch(undefined),
  status: z.enum(["draft", "published"]).optional().catch(undefined),
  sort: z
    .enum(["createdAt", "price", "title"])
    .default("createdAt")
    .catch("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  page: pageSchema,
});
export type ListAdminListingsQuery = z.infer<
  typeof listAdminListingsQuerySchema
>;

function requiredNumber<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (value === "" ? undefined : value), schema);
}

function nullable<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (value) => (value === "" ? null : value),
    schema.nullable(),
  );
}

export const listingInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).default(""),
  propertyType: propertyTypeSchema,
  price: requiredNumber(z.coerce.number().int().positive()),
  surfaceArea: nullable(z.coerce.number().int().positive()),
  landArea: nullable(z.coerce.number().int().positive()),
  rooms: nullable(z.coerce.number().int().min(0)),
  bedrooms: nullable(z.coerce.number().int().min(0)),
  energyClass: nullable(energyClassSchema),
  address: z.string().default(""),
  postalCode: z.string().regex(/^[0-9]{5}$/),
  city: cityNameSchema,
  latitude: requiredNumber(z.coerce.number().min(-90).max(90)),
  longitude: requiredNumber(z.coerce.number().min(-180).max(180)),
  published: z.boolean().default(false),
  agentId: nullable(z.uuid()),
});
export type ListingInput = z.infer<typeof listingInputSchema>;
