import type { ListingInput } from "@remix-v3-demo/domain/listing/listing-validator";

import { useState } from "react";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import type { ListingFormTab } from "./listing-form-tab.ts";

import { ListingForm } from "./listing-form.tsx";

const listing: ListingInput = {
  title: "Villa Belle Époque",
  description: "Vue mer.",
  propertyType: "house",
  price: 2450000,
  surfaceArea: 280,
  landArea: null,
  rooms: 8,
  bedrooms: 5,
  energyClass: "C",
  address: "12 boulevard du Mont Boron",
  postalCode: "06300",
  city: "Nice",
  latitude: 43.6961,
  longitude: 7.2957,
  published: false,
  agentId: null,
};

function TabbedListingForm({
  isManager,
  onSubmit,
}: {
  isManager: boolean;
  onSubmit: (input: ListingInput) => Promise<void>;
}) {
  const [tab, setTab] = useState<ListingFormTab>("general");
  return (
    <ListingForm
      title="Villa"
      listing={listing}
      agents={[]}
      isManager={isManager}
      tab={tab}
      onTabChange={setTab}
      onSubmit={onSubmit}
    />
  );
}

async function renderForm(isManager: boolean) {
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  await render(<TabbedListingForm isManager={isManager} onSubmit={onSubmit} />);
  return onSubmit;
}

describe("ListingForm", () => {
  it.each([
    ["a manager", true, 1],
    ["an agent", false, 0],
  ])(
    "should show the publish checkbox only to managers, here %s",
    async (_, isManager, count) => {
      await renderForm(isManager);

      await expect.element(page.getByLabelText("Titre *")).toBeVisible();
      expect(
        page.getByRole("checkbox", { name: "Publiée" }).elements(),
      ).toHaveLength(count);
    },
  );

  it("should reject a price that is not a whole positive number", async () => {
    const onSubmit = await renderForm(true);

    await page.getByLabelText("Prix (€) *").fill("-5");
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByLabelText("Prix (€) *"))
      .toHaveAccessibleDescription(/.+/);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should submit the listing with its numbers parsed", async () => {
    const onSubmit = await renderForm(true);

    await page.getByLabelText("Prix (€) *").fill("2300000");
    await page.getByRole("tab", { name: "Caractéristiques" }).click();
    await page.getByLabelText("Terrain (m²)").fill("1200");
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .poll(() => onSubmit.mock.calls)
      .toEqual([[{ ...listing, price: 2300000, landArea: 1200 }]]);
  });

  it("should open the tab holding an invalid field on submit", async () => {
    const onSubmit = await renderForm(true);
    await page.getByRole("tab", { name: "Localisation" }).click();
    await page.getByLabelText("Latitude *").fill("");
    await page.getByRole("tab", { name: "Général" }).click();

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByRole("tab", { name: /Localisation/ }))
      .toHaveAttribute("aria-selected", "true");
    await expect.element(page.getByLabelText("Latitude *")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should fill the city from a target city postal code", async () => {
    await renderForm(true);
    await page.getByRole("tab", { name: "Localisation" }).click();

    await page.getByLabelText("Code postal *").fill("69003");

    await expect
      .element(page.getByRole("combobox", { name: /^Ville/ }))
      .toHaveValue("Lyon");
  });
});
