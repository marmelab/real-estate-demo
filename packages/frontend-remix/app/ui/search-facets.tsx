import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { Handle } from "remix/component";

import { propertyTypeSchema } from "@remix-v3-demo/domain/listing/model";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import {
  COUNT_FACETS,
  ENERGY_CLASS_FACETS,
} from "@remix-v3-demo/domain/listing/search-facets";

import { routes } from "../routes.ts";
import { searchHref } from "./search-href.ts";

type ChipFacet = "propertyType" | "minRooms" | "minBedrooms" | "energyClasses";

export function SearchFacets(handle: Handle<{ query: ListListingsQuery }>) {
  return () => {
    let { query } = handle.props;
    let chipValues: Record<ChipFacet, string | undefined> = {
      propertyType: query.propertyType,
      minRooms: query.minRooms?.toString(),
      minBedrooms: query.minBedrooms?.toString(),
      energyClasses: query.energyClasses?.join(","),
    };
    let hrefFor = (facet: ChipFacet, value: string | undefined) =>
      searchHref({ ...query, ...toQuery(facet, value), page: 1 });

    return (
      <div>
        <input id={handle.id} type="checkbox" class="peer sr-only" />
        <label
          htmlFor={handle.id}
          class="button-outline peer-focus-visible:outline-gold w-full cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 lg:hidden"
        >
          Filtres
        </label>
        <form
          method="get"
          action={routes.search.href()}
          class="border-obsidian-600 bg-obsidian-800 mt-4 hidden space-y-6 border p-5 peer-checked:block lg:mt-0 lg:block"
        >
          {Object.entries(chipValues).map(
            ([name, value]) =>
              value && (
                <input key={name} type="hidden" name={name} value={value} />
              ),
          )}
          <label class="field-label">
            Ville
            <input
              name="city"
              value={query.city}
              autoComplete="address-level2"
              class="field-input"
            />
          </label>
          <RangeFields
            legend="Budget (€)"
            min={{ name: "minPrice", value: query.minPrice }}
            max={{ name: "maxPrice", value: query.maxPrice }}
          />
          <ChipLinks
            legend="Type de bien"
            facet="propertyType"
            selected={chipValues.propertyType}
            options={propertyTypeSchema.options.map((propertyType) => [
              propertyType,
              PROPERTY_TYPE_LABELS[propertyType],
            ])}
            hrefFor={hrefFor}
          />
          <RangeFields
            legend="Surface (m²)"
            min={{ name: "minSurface", value: query.minSurface }}
            max={{ name: "maxSurface", value: query.maxSurface }}
          />
          <ChipLinks
            legend="Pièces"
            facet="minRooms"
            selected={chipValues.minRooms}
            options={COUNT_FACETS}
            hrefFor={hrefFor}
            anyLabel="Toutes"
            isSingleRow
          />
          <ChipLinks
            legend="Chambres"
            facet="minBedrooms"
            selected={chipValues.minBedrooms}
            options={COUNT_FACETS}
            hrefFor={hrefFor}
            anyLabel="Toutes"
            isSingleRow
          />
          <ChipLinks
            legend="Classe énergie (DPE)"
            facet="energyClasses"
            selected={chipValues.energyClasses}
            options={ENERGY_CLASS_FACETS}
            hrefFor={hrefFor}
            anyLabel="Toutes"
            isSingleRow
          />
          <div class="border-obsidian-700 space-y-3 border-t pt-6">
            <button type="submit" class="button-gold w-full">
              Appliquer
            </button>
            <a
              href={searchHref({ city: query.city })}
              class="eyebrow hover:text-gold-light focus-visible:outline-gold flex min-h-11 items-center justify-center focus-visible:outline-2"
            >
              Réinitialiser les filtres
            </a>
          </div>
        </form>
      </div>
    );
  };
}

function toQuery(
  facet: ChipFacet,
  value: string | undefined,
): Partial<ListListingsQuery> {
  if (value === undefined) return { [facet]: undefined };
  if (facet === "energyClasses") {
    return {
      energyClasses: value.split(",") as ListListingsQuery["energyClasses"],
    };
  }
  if (facet === "propertyType") {
    return { propertyType: value as ListListingsQuery["propertyType"] };
  }
  return { [facet]: Number(value) };
}

function RangeFields(
  handle: Handle<{
    legend: string;
    min: { name: string; value: number | undefined };
    max: { name: string; value: number | undefined };
  }>,
) {
  return () => {
    let { legend, min, max } = handle.props;

    return (
      <fieldset class="border-obsidian-700 border-t pt-6">
        <legend class="field-label float-left mb-3 w-full">{legend}</legend>
        <div class="clear-left grid grid-cols-2 gap-3">
          <NumberField label="Minimum" {...min} />
          <NumberField label="Maximum" {...max} />
        </div>
      </fieldset>
    );
  };
}

function NumberField(
  handle: Handle<{ label: string; name: string; value: number | undefined }>,
) {
  return () => (
    <label class="field-label min-w-0">
      {handle.props.label}
      <input
        name={handle.props.name}
        value={handle.props.value?.toString()}
        inputMode="numeric"
        class="field-input"
      />
    </label>
  );
}

function ChipLinks(
  handle: Handle<{
    legend: string;
    facet: ChipFacet;
    selected: string | undefined;
    options: [string, string][];
    hrefFor: (facet: ChipFacet, value: string | undefined) => string;
    anyLabel?: string;
    isSingleRow?: boolean;
  }>,
) {
  return () => {
    let {
      legend,
      facet,
      selected,
      options,
      hrefFor,
      anyLabel = "Indifférent",
      isSingleRow = false,
    } = handle.props;
    let chips: [string | undefined, string][] = [
      [undefined, anyLabel],
      ...options,
    ];

    return (
      <div class="border-obsidian-700 border-t pt-6">
        <p id={handle.id} class="field-label mb-3">
          {legend}
        </p>
        <ul
          aria-labelledby={handle.id}
          class={`flex gap-2 ${isSingleRow ? "flex-nowrap" : "flex-wrap"}`}
        >
          {chips.map(([value, label]) => {
            let isSelected = value === selected;
            return (
              <li
                key={label}
                class={isSingleRow ? "flex flex-1 first:flex-none" : "flex"}
              >
                <a
                  href={hrefFor(facet, value)}
                  aria-current={isSelected ? "true" : undefined}
                  class={`focus-visible:outline-gold flex min-h-11 min-w-11 flex-1 items-center justify-center border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isSelected
                      ? "border-gold bg-gold text-obsidian-950 font-semibold"
                      : "border-obsidian-600 bg-obsidian-900 hover:border-gold text-gray-300"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}
