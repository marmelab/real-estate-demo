import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { routes } from "../routes.ts";

export function searchHref(query: Partial<ListListingsQuery>): string {
  let params = new URLSearchParams();
  for (let [key, value] of Object.entries(query)) {
    if (value === undefined || (key === "page" && value === 1)) continue;
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  let search = params.toString();
  return search ? `${routes.search.href()}?${search}` : routes.search.href();
}
