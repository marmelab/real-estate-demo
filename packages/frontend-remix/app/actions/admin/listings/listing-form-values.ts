import type { ListingInput } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListing } from "@remix-v3-demo/domain/listing/model";

import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";

import { readText } from "../../../ui/form/read-text.ts";

export type ListingFormTab = "general" | "details" | "location" | "photos";

type ListingFormListing = Pick<AdminListing, keyof ListingInput>;
type TextFieldName = Exclude<keyof ListingInput, "published">;

export type ListingFormValues = Record<TextFieldName, string> & {
  published: boolean;
};

export const TAB_FIELDS: Record<
  Exclude<ListingFormTab, "photos">,
  (keyof ListingInput)[]
> = {
  general: [
    "title",
    "propertyType",
    "price",
    "agentId",
    "description",
    "published",
  ],
  details: ["surfaceArea", "landArea", "rooms", "bedrooms", "energyClass"],
  location: ["address", "postalCode", "city", "latitude", "longitude"],
};

const LISTING_FORM_TABS: ListingFormTab[] = [
  "general",
  "details",
  "location",
  "photos",
];

const TEXT_FIELD_NAMES = Object.values(TAB_FIELDS)
  .flat()
  .filter((name): name is TextFieldName => name !== "published");

export function parseListingFormTab(value: string | null): ListingFormTab {
  return LISTING_FORM_TABS.find((tab) => tab === value) ?? "general";
}

export function findTabWithError(
  errors: FieldErrors,
): ListingFormTab | undefined {
  return LISTING_FORM_TABS.find(
    (tab) => tab !== "photos" && TAB_FIELDS[tab].some((name) => name in errors),
  );
}

function toText(value: number | string | null | undefined): string {
  return value == null ? "" : String(value);
}

export function toFormValues(listing?: ListingFormListing): ListingFormValues {
  return {
    ...(Object.fromEntries(
      TEXT_FIELD_NAMES.map((name) => [name, toText(listing?.[name])]),
    ) as Record<TextFieldName, string>),
    published: listing?.published ?? false,
  };
}

export function readListingForm(
  formData: FormData,
  isManager: boolean,
  listing?: ListingFormListing,
): ListingFormValues {
  return {
    ...(Object.fromEntries(
      TEXT_FIELD_NAMES.map((name) => [name, readText(formData, name)]),
    ) as Record<TextFieldName, string>),
    published: isManager
      ? formData.has("published")
      : (listing?.published ?? false),
  };
}
