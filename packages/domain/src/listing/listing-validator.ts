import { z } from "zod";

import { transactionTypeSchema } from "./model.ts";

const positiveIntSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .catch(undefined);

export const listListingsQuerySchema = z.object({
  transactionType: transactionTypeSchema.default("sale").catch("sale"),
  city: z
    .string()
    .trim()
    .transform((city) => city || undefined)
    .optional()
    .catch(undefined),
  minPrice: positiveIntSchema,
  maxPrice: positiveIntSchema,
  minRooms: positiveIntSchema,
  minBedrooms: positiveIntSchema,
  minSurface: positiveIntSchema,
  page: z.coerce.number().int().min(1).default(1).catch(1),
});
export type ListListingsQuery = z.infer<typeof listListingsQuerySchema>;
