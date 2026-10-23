import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { Handle, RemixNode } from "remix/component";

import {
  energyClassSchema,
  propertyTypeSchema,
} from "@remix-v3-demo/domain/listing/model";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { CircleAlert } from "lucide";

import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";
import type {
  ListingFormTab,
  ListingFormValues,
} from "./listing-form-values.ts";

import { ConfirmButton } from "../../../ui/confirm-button.tsx";
import { CheckboxField } from "../../../ui/form/checkbox-field.tsx";
import { FormActions } from "../../../ui/form/form-actions.tsx";
import { SelectField } from "../../../ui/form/select-field.tsx";
import { SubmitButton } from "../../../ui/form/submit-button.tsx";
import { TextAreaField } from "../../../ui/form/text-area-field.tsx";
import { TextField } from "../../../ui/form/text-field.tsx";
import { Icon } from "../../../ui/icon.tsx";
import { TAB_FIELDS } from "./listing-form-values.ts";
import { CityFromPostalCode } from "./public/city-from-postal-code.tsx";

const PROPERTY_TYPE_OPTIONS = propertyTypeSchema.options.map(
  (propertyType) => [propertyType, PROPERTY_TYPE_LABELS[propertyType]] as const,
);
const ENERGY_CLASS_OPTIONS = energyClassSchema.options.map(
  (energyClass) => [energyClass, energyClass] as const,
);
const CITY_OPTIONS = TARGET_CITIES.map(({ name }) => [name, name] as const);

const TAB_LABELS: Record<ListingFormTab, string> = {
  general: "Général",
  details: "Caractéristiques",
  location: "Localisation",
  photos: "Photos",
};

const TAB_INPUT_ID: Record<ListingFormTab, string> = {
  general: "listing-tab-general",
  details: "listing-tab-details",
  location: "listing-tab-location",
  photos: "listing-tab-photos",
};

const PANEL_CLASS: Record<ListingFormTab, string> = {
  general: "hidden pt-8 group-has-[#listing-tab-general:checked]/tabs:block",
  details: "hidden pt-8 group-has-[#listing-tab-details:checked]/tabs:block",
  location: "hidden pt-8 group-has-[#listing-tab-location:checked]/tabs:block",
  photos: "hidden pt-8 group-has-[#listing-tab-photos:checked]/tabs:block",
};

const POSTAL_CODE_ID = "listing-postal-code";
const CITY_ID = "listing-city";

export type ListingFormProps = {
  title: string;
  action: string;
  values: ListingFormValues;
  agents: Pick<Agent, "id" | "firstName" | "lastName">[];
  isManager: boolean;
  tab: ListingFormTab;
  errors?: FieldErrors;
  error?: string;
  photos?: RemixNode;
  canDelete?: boolean;
};

export function ListingForm(handle: Handle<ListingFormProps>) {
  return () => {
    let { title, action, values, agents, isManager, tab, photos } =
      handle.props;
    let { errors = {}, error, canDelete = false } = handle.props;
    let formTabs = Object.keys(TAB_FIELDS) as Exclude<
      ListingFormTab,
      "photos"
    >[];
    let tabIds: ListingFormTab[] = photos ? [...formTabs, "photos"] : formTabs;
    let selectedTab = tabIds.includes(tab) ? tab : "general";

    return (
      <div class="group/tabs flex max-w-2xl flex-1 flex-col">
        <div class="bg-obsidian-900 sticky top-0 z-10 -mt-6 space-y-6 pt-6 md:-mt-10 md:pt-10">
          <h1 class="text-3xl font-light text-white">{title}</h1>
          <fieldset
            data-rmx-key={crypto.randomUUID()}
            class="border-obsidian-600 flex flex-wrap border-b"
          >
            <legend class="sr-only">Sections de l'annonce</legend>
            {tabIds.map((id) => (
              <label
                key={id}
                class="has-focus-visible:outline-gold has-checked:border-gold has-checked:text-gold -mb-px flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-5 text-xs font-semibold tracking-[0.15em] text-gray-300 uppercase transition-colors not-has-checked:hover:text-white has-focus-visible:outline-2 has-focus-visible:-outline-offset-2"
              >
                <input
                  type="radio"
                  id={TAB_INPUT_ID[id]}
                  name="listing-tab"
                  value={id}
                  checked={id === selectedTab}
                  class="sr-only"
                />
                {TAB_LABELS[id]}
                {id !== "photos" &&
                  TAB_FIELDS[id].some((name) => name in errors) && (
                    <span class="text-red-300">
                      <Icon icon={CircleAlert} class="size-4" />
                      <span class="sr-only">(erreurs)</span>
                    </span>
                  )}
              </label>
            ))}
          </fieldset>
        </div>
        <form
          method="post"
          action={action}
          noValidate
          class="flex flex-1 flex-col gap-10 group-has-[#listing-tab-photos:checked]/tabs:hidden"
        >
          <div class={PANEL_CLASS.general}>
            <div class="space-y-6">
              <TextField
                label="Titre"
                name="title"
                value={values.title}
                isRequired
                error={errors.title}
              />
              <SelectField
                label="Type de bien"
                name="propertyType"
                value={values.propertyType}
                options={PROPERTY_TYPE_OPTIONS}
                emptyLabel="Choisir"
                isRequired
                error={errors.propertyType}
              />
              <TextField
                label="Prix (€)"
                name="price"
                value={values.price}
                inputMode="numeric"
                hint="Prix de vente en euros, sans espaces."
                isRequired
                error={errors.price}
              />
              <TextAreaField
                label="Description"
                name="description"
                value={values.description}
                error={errors.description}
              />
              <SelectField
                label="Agent"
                name="agentId"
                value={values.agentId}
                options={agents.map(
                  (agent) =>
                    [agent.id, `${agent.firstName} ${agent.lastName}`] as const,
                )}
                emptyLabel="Aucun"
                error={errors.agentId}
              />
              {isManager && (
                <CheckboxField
                  label="Publiée"
                  name="published"
                  isChecked={values.published}
                />
              )}
            </div>
          </div>
          <div class={PANEL_CLASS.details}>
            <div class="space-y-6">
              <TextField
                label="Surface (m²)"
                name="surfaceArea"
                value={values.surfaceArea}
                inputMode="numeric"
                hint="Surface loi Carrez."
                error={errors.surfaceArea}
              />
              <TextField
                label="Terrain (m²)"
                name="landArea"
                value={values.landArea}
                inputMode="numeric"
                error={errors.landArea}
              />
              <TextField
                label="Pièces"
                name="rooms"
                value={values.rooms}
                inputMode="numeric"
                error={errors.rooms}
              />
              <TextField
                label="Chambres"
                name="bedrooms"
                value={values.bedrooms}
                inputMode="numeric"
                error={errors.bedrooms}
              />
              <SelectField
                label="Classe énergie (DPE)"
                name="energyClass"
                value={values.energyClass}
                options={ENERGY_CLASS_OPTIONS}
                emptyLabel="Non renseignée"
                error={errors.energyClass}
              />
            </div>
          </div>
          <div class={PANEL_CLASS.location}>
            <div class="space-y-6">
              <TextField
                label="Adresse"
                name="address"
                value={values.address}
                autoComplete="street-address"
                error={errors.address}
              />
              <TextField
                id={POSTAL_CODE_ID}
                label="Code postal"
                name="postalCode"
                value={values.postalCode}
                inputMode="numeric"
                autoComplete="postal-code"
                hint="La ville se remplit d'après le code postal."
                isRequired
                error={errors.postalCode}
              />
              <SelectField
                id={CITY_ID}
                label="Ville"
                name="city"
                value={values.city}
                options={CITY_OPTIONS}
                emptyLabel="Choisir"
                isRequired
                error={errors.city}
              />
              <CityFromPostalCode
                postalCodeId={POSTAL_CODE_ID}
                cityId={CITY_ID}
              />
              <TextField
                label="Latitude"
                name="latitude"
                value={values.latitude}
                inputMode="decimal"
                hint="Clic droit sur le lieu dans Google Maps pour copier ses coordonnées, par exemple 48.8566."
                isRequired
                error={errors.latitude}
              />
              <TextField
                label="Longitude"
                name="longitude"
                value={values.longitude}
                inputMode="decimal"
                hint="Par exemple 2.3522."
                isRequired
                error={errors.longitude}
              />
            </div>
          </div>
          <FormActions error={error}>
            <SubmitButton label="Enregistrer" />
            {isManager && canDelete && (
              <ConfirmButton
                label="Supprimer l'annonce"
                title="Supprimer cette annonce ?"
                message="L'annonce et ses photos seront supprimées définitivement."
                confirmLabel="Supprimer"
                class="button-ghost"
                submitter={{ name: "_method", value: "DELETE" }}
              />
            )}
          </FormActions>
        </form>
        {photos && <div class={PANEL_CLASS.photos}>{photos}</div>}
      </div>
    );
  };
}
