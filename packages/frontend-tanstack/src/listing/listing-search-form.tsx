import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { propertyTypeSchema } from "@remix-v3-demo/domain/listing/model";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import {
  COUNT_FACETS,
  ENERGY_CLASS_FACETS,
} from "@remix-v3-demo/domain/listing/search-facets";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function ListingSearchForm({
  search,
  onSearch,
}: {
  search: ListListingsQuery;
  onSearch: (search: ListListingsQuery) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="listing-filters"
        onClick={() => setIsOpen(!isOpen)}
        className="button-outline w-full lg:hidden"
      >
        {isOpen ? "Masquer les filtres" : "Afficher les filtres"}
      </button>
      <form
        id="listing-filters"
        method="get"
        action="/search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(
            listListingsQuerySchema.parse(
              Object.fromEntries(new FormData(event.currentTarget)),
            ),
          );
        }}
        onChange={(event) => {
          if (
            event.target instanceof HTMLInputElement &&
            event.target.type === "radio"
          ) {
            event.currentTarget.requestSubmit();
          }
        }}
        className={`${isOpen ? "block" : "hidden"} border-obsidian-600 bg-obsidian-800 mt-4 space-y-6 border p-5 lg:mt-0 lg:block`}
      >
        <label className="field-label">
          Ville
          <input
            name="city"
            defaultValue={search.city}
            autoComplete="address-level2"
            className="field-input"
          />
        </label>
        <RangeFields
          legend="Budget (€)"
          min={{ name: "minPrice", value: search.minPrice }}
          max={{ name: "maxPrice", value: search.maxPrice }}
        />
        <ChipGroup
          legend="Type de bien"
          name="propertyType"
          value={search.propertyType}
          options={propertyTypeSchema.options.map((propertyType) => [
            propertyType,
            PROPERTY_TYPE_LABELS[propertyType],
          ])}
        />
        <RangeFields
          legend="Surface (m²)"
          min={{ name: "minSurface", value: search.minSurface }}
          max={{ name: "maxSurface", value: search.maxSurface }}
        />
        <ChipGroup
          legend="Pièces"
          name="minRooms"
          value={search.minRooms}
          options={COUNT_FACETS}
          anyLabel="Toutes"
          isSingleRow
        />
        <ChipGroup
          legend="Chambres"
          name="minBedrooms"
          value={search.minBedrooms}
          options={COUNT_FACETS}
          anyLabel="Toutes"
          isSingleRow
        />
        <ChipGroup
          legend="Classe énergie (DPE)"
          name="energyClasses"
          value={search.energyClasses?.join(",")}
          options={ENERGY_CLASS_FACETS}
          anyLabel="Toutes"
          isSingleRow
        />
        <div className="border-obsidian-700 space-y-3 border-t pt-6">
          <button type="submit" className="button-gold w-full">
            Appliquer
          </button>
          <Link
            to="/search"
            search={{ city: search.city }}
            className="eyebrow hover:text-gold-light focus-visible:outline-gold flex min-h-11 items-center justify-center focus-visible:outline-2"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      </form>
    </div>
  );
}

function RangeFields({
  legend,
  min,
  max,
}: {
  legend: string;
  min: { name: string; value: number | undefined };
  max: { name: string; value: number | undefined };
}) {
  return (
    <fieldset className="border-obsidian-700 border-t pt-6">
      <legend className="field-label float-left mb-3 w-full">{legend}</legend>
      <div className="clear-left grid grid-cols-2 gap-3">
        <NumberField label="Minimum" name={min.name} defaultValue={min.value} />
        <NumberField label="Maximum" name={max.name} defaultValue={max.value} />
      </div>
    </fieldset>
  );
}

function NumberField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: number | undefined;
}) {
  return (
    <label className="field-label min-w-0">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        inputMode="numeric"
        className="field-input"
      />
    </label>
  );
}

function ChipGroup({
  legend,
  name,
  value,
  options,
  anyLabel = "Indifférent",
  isSingleRow = false,
}: {
  legend: string;
  name: string;
  value: string | number | undefined;
  options: [string, string][];
  anyLabel?: string;
  isSingleRow?: boolean;
}) {
  return (
    <fieldset className="border-obsidian-700 border-t pt-6">
      <legend className="field-label float-left mb-3 w-full">{legend}</legend>
      <div
        className={`clear-left flex gap-2 ${isSingleRow ? "flex-nowrap" : "flex-wrap"}`}
      >
        {[["", anyLabel], ...options].map(([optionValue, label]) => (
          <label
            key={optionValue}
            className={`${isSingleRow ? "flex-1 first:flex-none first:px-4" : ""} border-obsidian-600 bg-obsidian-900 hover:border-gold has-checked:border-gold has-checked:bg-gold has-checked:text-obsidian-950 has-focus-visible:outline-gold flex min-h-11 min-w-11 cursor-pointer items-center justify-center border px-3 text-sm text-gray-300 has-checked:font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2`}
          >
            <input
              type="radio"
              name={name}
              value={optionValue}
              defaultChecked={String(value ?? "") === optionValue}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
