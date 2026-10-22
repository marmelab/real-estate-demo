import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingCard } from "./listing-card.tsx";

const listing: ListingSummary = {
  id: 3,
  title: "Hôtel particulier · Brotteaux",
  price: 640000,
  propertyType: "house",
  surfaceArea: 140,
  rooms: 6,
  bedrooms: 4,
  city: "Lyon",
  postalCode: "69004",
  image: null,
};

async function renderCard(card: ListingSummary) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => <ListingCard listing={card} />,
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

describe("ListingCard", () => {
  it("should link to the listing page with its price and title", async () => {
    await renderCard(listing);

    await expect
      .element(
        page.getByRole("link", {
          name: /640\s000\s€.*Hôtel particulier · Brotteaux/,
        }),
      )
      .toHaveAttribute("href", "/listings/3");
  });

  it.each([
    ["no image", null],
    ["a broken image", { url: "/missing.jpg", alt: "Façade de la maison" }],
  ])(
    "should show the placeholder when the listing has %s",
    async (_, image) => {
      await renderCard({ ...listing, image });

      await expect.element(page.getByText("Photos sur demande")).toBeVisible();
    },
  );
});
