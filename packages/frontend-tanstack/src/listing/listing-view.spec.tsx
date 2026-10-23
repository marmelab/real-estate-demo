import type { Listing } from "@remix-v3-demo/domain/listing/model";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingView } from "./listing-view.tsx";

const listing: Listing = {
  id: 7,
  title: "Appartement Haussmannien · Monceau",
  price: 890000,
  propertyType: "apartment",
  surfaceArea: 180,
  landArea: null,
  rooms: 6,
  bedrooms: 3,
  energyClass: "C",
  city: "Paris",
  postalCode: "75008",
  address: "12 rue de Monceau",
  description: "Parquet, moulures et cheminées.",
  images: [],
  agent: { firstName: "Claire", lastName: "Martin" },
};

async function renderView(view: Listing) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => <ListingView listing={view} />,
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

describe("ListingView", () => {
  it("should show the price in euros", async () => {
    await renderView(listing);

    await expect.element(page.getByText(/^890\s000\s€$/)).toBeVisible();
  });

  it("should list only the known facts", async () => {
    await renderView(listing);

    await expect
      .poll(() =>
        page
          .getByRole("term")
          .elements()
          .map((term) => [term.textContent, term.nextSibling?.textContent]),
      )
      .toEqual([
        ["Type de bien", "Appartement"],
        ["Surface", "180 m²"],
        ["Pièces", "6"],
        ["Chambres", "3"],
        ["Classe énergie (DPE)", "C"],
      ]);
  });

  it("should present the agent in charge", async () => {
    await renderView(listing);

    await expect.element(page.getByText("Claire Martin")).toBeVisible();
  });

  it("should omit the agent when none is in charge", async () => {
    await renderView({ ...listing, agent: null });

    await expect.element(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect
      .element(page.getByText("Votre conseiller privé"))
      .not.toBeInTheDocument();
  });

  it("should link back to the search in the listing city", async () => {
    await renderView(listing);

    await expect
      .element(page.getByRole("link", { name: "Retour à la recherche" }))
      .toHaveAttribute("href", "/search?city=Paris");
  });
});
