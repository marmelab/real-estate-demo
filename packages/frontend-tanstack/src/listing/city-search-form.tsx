import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { Search } from "lucide-react";

export function CitySearchForm({
  onSearch,
}: {
  onSearch: (search: ListListingsQuery) => void;
}) {
  return (
    <form
      method="get"
      action="/search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(
          listListingsQuerySchema.parse(
            Object.fromEntries(new FormData(event.currentTarget)),
          ),
        );
      }}
      className="border-gold bg-obsidian-800 mx-auto flex max-w-3xl flex-col gap-4 border p-4 text-left sm:flex-row sm:items-end sm:p-6"
    >
      <label className="field-label flex-1">
        Ville
        <input
          name="city"
          autoComplete="address-level2"
          placeholder="Paris, Lyon, Nice, Cannes"
          className="field-input"
        />
      </label>
      <label className="field-label sm:w-48">
        Budget max (€)
        <input
          name="maxPrice"
          inputMode="numeric"
          placeholder="Indifférent"
          className="field-input"
        />
      </label>
      <button type="submit" className="button-gold">
        <Search aria-hidden="true" className="size-4" />
        Rechercher
      </button>
    </form>
  );
}
