import { z } from "zod";

import { energyClassSchema, propertyTypeSchema } from "./model.ts";

const positiveIntSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .catch(undefined);

export const listListingsQuerySchema = z.object({
  city: z
    .string()
    .trim()
    .transform((city) => city || undefined)
    .optional()
    .catch(undefined),
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
  page: z.coerce.number().int().min(1).default(1).catch(1),
});
export type ListListingsQuery = z.infer<typeof listListingsQuerySchema>;
