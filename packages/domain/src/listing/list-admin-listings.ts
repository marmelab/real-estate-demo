import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListAdminListingsQuery } from "./listing-validator.ts";
import type { AdminListingSummary } from "./model.ts";

import { adminListingSummarySchema } from "./model.ts";

export const ADMIN_PAGE_SIZE = 20;

const SORT_COLUMNS: Record<ListAdminListingsQuery["sort"], string> = {
  createdAt: "created_at",
  price: "price",
  title: "title",
};

export async function listAdminListings(
  client: SupabaseClient,
  query: ListAdminListingsQuery,
): Promise<{ listings: AdminListingSummary[]; total: number }> {
  let request = client
    .from("listing")
    .select(
      "id, title, price, propertyType:property_type, city, postalCode:postal_code, published, createdAt:created_at, agent(firstName:first_name, lastName:last_name)",
      { count: "exact" },
    );
  if (query.q) {
    request = request.ilike("title", `%${query.q.replace(/[\\%_]/g, "\\$&")}%`);
  }
  if (query.city) request = request.eq("city", query.city);
  if (query.status)
    request = request.eq("published", query.status === "published");

  const from = (query.page - 1) * ADMIN_PAGE_SIZE;
  const { data, count, error } = await request
    .order(SORT_COLUMNS[query.sort], { ascending: query.order === "asc" })
    .range(from, from + ADMIN_PAGE_SIZE - 1);
  if (error) throw error;

  return {
    listings: z.array(adminListingSummarySchema).parse(data),
    total: count ?? 0,
  };
}
