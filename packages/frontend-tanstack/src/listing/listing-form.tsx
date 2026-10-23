import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { ListingInput } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListing } from "@remix-v3-demo/domain/listing/model";
import type { ReactNode } from "react";

import { findTargetCityByPostalCode } from "@remix-v3-demo/domain/listing/find-target-city-by-postal-code";
import { listingInputSchema } from "@remix-v3-demo/domain/listing/listing-validator";
import {
  energyClassSchema,
  propertyTypeSchema,
} from "@remix-v3-demo/domain/listing/model";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { useId } from "react";

import type { Tab } from "../components/tabs.tsx";
import type { ListingFormTab } from "./listing-form-tab.ts";

import { ConfirmButton } from "../components/confirm-button.tsx";
import { useAppForm } from "../components/form/app-form.tsx";
import { FormActions } from "../components/form/form-actions.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { validateWith } from "../components/form/validate-with.ts";
import { TabList, TabPanel } from "../components/tabs.tsx";

type ListingFormListing = Pick<AdminListing, keyof ListingInput>;

const PROPERTY_TYPE_OPTIONS = propertyTypeSchema.options.map(
  (propertyType) => [propertyType, PROPERTY_TYPE_LABELS[propertyType]] as const,
);
const ENERGY_CLASS_OPTIONS = energyClassSchema.options.map(
  (energyClass) => [energyClass, energyClass] as const,
);
const CITY_OPTIONS = TARGET_CITIES.map(({ name }) => [name, name] as const);

const TAB_FIELDS: Record<
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

const TAB_LABELS: Record<ListingFormTab, string> = {
  general: "Général",
  details: "Caractéristiques",
  location: "Localisation",
  photos: "Photos",
};

function toText(value: number | string | null | undefined): string {
  return value == null ? "" : String(value);
}

function toFormValues(listing?: ListingFormListing) {
  return {
    title: listing?.title ?? "",
    description: listing?.description ?? "",
    propertyType: listing?.propertyType ?? "",
    price: toText(listing?.price),
    surfaceArea: toText(listing?.surfaceArea),
    landArea: toText(listing?.landArea),
    rooms: toText(listing?.rooms),
    bedrooms: toText(listing?.bedrooms),
    energyClass: toText(listing?.energyClass),
    address: listing?.address ?? "",
    postalCode: listing?.postalCode ?? "",
    city: listing?.city ?? "",
    latitude: toText(listing?.latitude),
    longitude: toText(listing?.longitude),
    published: listing?.published ?? false,
    agentId: toText(listing?.agentId),
  };
}

function hasFieldError(meta: { errors: unknown[] } | undefined): boolean {
  return (meta?.errors.length ?? 0) > 0;
}

export function ListingForm({
  title,
  listing,
  agents,
  isManager,
  tab,
  onTabChange,
  photos,
  onSubmit,
  onDelete,
}: {
  title: string;
  listing?: ListingFormListing;
  agents: Pick<Agent, "id" | "firstName" | "lastName">[];
  isManager: boolean;
  tab: ListingFormTab;
  onTabChange: (tab: ListingFormTab) => void;
  photos?: ReactNode;
  onSubmit: (input: ListingInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const idPrefix = useId();
  const { error, submit } = useSubmitError("Enregistrement impossible");
  const form = useAppForm({
    defaultValues: toFormValues(listing),
    validators: { onSubmit: validateWith(listingInputSchema) },
    onSubmit: ({ value }) =>
      submit(() => onSubmit(listingInputSchema.parse(value))),
    onSubmitInvalid: ({ formApi }) => {
      const tabWithError = Object.entries(TAB_FIELDS).find(([, fields]) =>
        fields.some((name) => hasFieldError(formApi.getFieldMeta(name))),
      );
      if (tabWithError) onTabChange(tabWithError[0] as ListingFormTab);
    },
  });
  const formTabs = Object.keys(TAB_FIELDS) as Exclude<
    ListingFormTab,
    "photos"
  >[];
  const tabIds: ListingFormTab[] = photos ? [...formTabs, "photos"] : formTabs;
  const selectedTab = tabIds.includes(tab) ? tab : "general";

  return (
    <div className="flex max-w-2xl flex-1 flex-col">
      <div className="bg-obsidian-900 sticky top-0 z-10 -mt-6 space-y-6 pt-6 md:-mt-10 md:pt-10">
        <h1 className="text-3xl font-light text-white">{title}</h1>
        <form.Subscribe selector={(state) => state.fieldMeta}>
          {(fieldMeta) => (
            <TabList
              idPrefix={idPrefix}
              label="Sections de l'annonce"
              tabs={tabIds.map((id): Tab<ListingFormTab> => ({
                id,
                label: TAB_LABELS[id],
                hasError:
                  id !== "photos" &&
                  TAB_FIELDS[id].some((name) => hasFieldError(fieldMeta[name])),
              }))}
              selected={selectedTab}
              onSelect={onTabChange}
            />
          )}
        </form.Subscribe>
      </div>
      <form
        method="post"
        noValidate
        className={
          selectedTab === "photos" ? undefined : "flex flex-1 flex-col gap-10"
        }
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <TabPanel
          idPrefix={idPrefix}
          id="general"
          isSelected={selectedTab === "general"}
        >
          <div className="space-y-6">
            <form.AppField name="title">
              {(field) => <field.TextField label="Titre" isRequired />}
            </form.AppField>
            <form.AppField name="propertyType">
              {(field) => (
                <field.SelectField
                  label="Type de bien"
                  options={PROPERTY_TYPE_OPTIONS}
                  emptyLabel="Choisir"
                  isRequired
                />
              )}
            </form.AppField>
            <form.AppField name="price">
              {(field) => (
                <field.TextField
                  label="Prix (€)"
                  inputMode="numeric"
                  hint="Prix de vente en euros, sans espaces."
                  isRequired
                />
              )}
            </form.AppField>
            <form.AppField name="description">
              {(field) => <field.TextAreaField label="Description" />}
            </form.AppField>
            <form.AppField name="agentId">
              {(field) => (
                <field.SelectField
                  label="Agent"
                  options={agents.map((agent) => [
                    agent.id,
                    `${agent.firstName} ${agent.lastName}`,
                  ])}
                  emptyLabel="Aucun"
                />
              )}
            </form.AppField>
            {isManager && (
              <form.AppField name="published">
                {(field) => <field.CheckboxField label="Publiée" />}
              </form.AppField>
            )}
          </div>
        </TabPanel>
        <TabPanel
          idPrefix={idPrefix}
          id="details"
          isSelected={selectedTab === "details"}
        >
          <div className="space-y-6">
            <form.AppField name="surfaceArea">
              {(field) => (
                <field.TextField
                  label="Surface (m²)"
                  inputMode="numeric"
                  hint="Surface loi Carrez."
                />
              )}
            </form.AppField>
            <form.AppField name="landArea">
              {(field) => (
                <field.TextField label="Terrain (m²)" inputMode="numeric" />
              )}
            </form.AppField>
            <form.AppField name="rooms">
              {(field) => (
                <field.TextField label="Pièces" inputMode="numeric" />
              )}
            </form.AppField>
            <form.AppField name="bedrooms">
              {(field) => (
                <field.TextField label="Chambres" inputMode="numeric" />
              )}
            </form.AppField>
            <form.AppField name="energyClass">
              {(field) => (
                <field.SelectField
                  label="Classe énergie (DPE)"
                  options={ENERGY_CLASS_OPTIONS}
                  emptyLabel="Non renseignée"
                />
              )}
            </form.AppField>
          </div>
        </TabPanel>
        <TabPanel
          idPrefix={idPrefix}
          id="location"
          isSelected={selectedTab === "location"}
        >
          <div className="space-y-6">
            <form.AppField name="address">
              {(field) => (
                <field.TextField
                  label="Adresse"
                  autoComplete="street-address"
                />
              )}
            </form.AppField>
            <form.AppField
              name="postalCode"
              listeners={{
                onChange: ({ value }) => {
                  const city = findTargetCityByPostalCode(value);
                  if (city) form.setFieldValue("city", city);
                },
              }}
            >
              {(field) => (
                <field.TextField
                  label="Code postal"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  hint="La ville se remplit d'après le code postal."
                  isRequired
                />
              )}
            </form.AppField>
            <form.AppField name="city">
              {(field) => (
                <field.SelectField
                  label="Ville"
                  options={CITY_OPTIONS}
                  emptyLabel="Choisir"
                  isRequired
                />
              )}
            </form.AppField>
            <form.AppField name="latitude">
              {(field) => (
                <field.TextField
                  label="Latitude"
                  inputMode="decimal"
                  hint="Clic droit sur le lieu dans Google Maps pour copier ses coordonnées, par exemple 48.8566."
                  isRequired
                />
              )}
            </form.AppField>
            <form.AppField name="longitude">
              {(field) => (
                <field.TextField
                  label="Longitude"
                  inputMode="decimal"
                  hint="Par exemple 2.3522."
                  isRequired
                />
              )}
            </form.AppField>
          </div>
        </TabPanel>
        {selectedTab !== "photos" && (
          <FormActions error={error}>
            <form.AppForm>
              <form.SubmitButton label="Enregistrer" />
            </form.AppForm>
            {isManager && onDelete && (
              <ConfirmButton
                label="Supprimer l'annonce"
                title="Supprimer cette annonce ?"
                message="L'annonce et ses photos seront supprimées définitivement."
                confirmLabel="Supprimer"
                className="button-ghost"
                onConfirm={() => void submit(onDelete)}
              />
            )}
          </FormActions>
        )}
      </form>
      {photos && (
        <TabPanel
          idPrefix={idPrefix}
          id="photos"
          isSelected={selectedTab === "photos"}
        >
          {photos}
        </TabPanel>
      )}
    </div>
  );
}
