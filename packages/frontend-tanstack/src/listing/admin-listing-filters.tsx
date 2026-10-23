import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { listAdminListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { useRef } from "react";

const TYPING_DELAY_MS = 300;

export function AdminListingFilters({
  search,
  onSearch,
}: {
  search: ListAdminListingsQuery;
  onSearch: (search: ListAdminListingsQuery) => void;
}) {
  const submitTimeout = useRef<number>(undefined);

  return (
    <form
      method="get"
      onChange={(event) => {
        const form = event.currentTarget;
        window.clearTimeout(submitTimeout.current);
        submitTimeout.current = window.setTimeout(
          () => form.requestSubmit(),
          event.target instanceof HTMLSelectElement ? 0 : TYPING_DELAY_MS,
        );
      }}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(
          listAdminListingsQuerySchema.parse({
            sort: search.sort,
            order: search.order,
            ...Object.fromEntries(new FormData(event.currentTarget)),
          }),
        );
      }}
      className="border-obsidian-600 bg-obsidian-800 grid gap-4 border p-5 md:grid-cols-3"
    >
      <label className="field-label">
        Titre
        <input
          type="search"
          name="q"
          defaultValue={search.q}
          className="field-input"
        />
      </label>
      <label className="field-label">
        Ville
        <select
          name="city"
          defaultValue={search.city ?? ""}
          className="field-input"
        >
          <option value="">Toutes</option>
          {TARGET_CITIES.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Statut
        <select
          name="status"
          defaultValue={search.status ?? ""}
          className="field-input"
        >
          <option value="">Tous</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publiée</option>
        </select>
      </label>
    </form>
  );
}
