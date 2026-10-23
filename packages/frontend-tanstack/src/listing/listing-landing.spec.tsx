import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingLanding } from "./listing-landing.tsx";

describe("ListingLanding", () => {
  it("should link to the page of each target city", async () => {
    const router = createRouter({
      routeTree: createRootRoute({
        component: () => <ListingLanding>Recherche</ListingLanding>,
      }),
      history: createMemoryHistory(),
    });
    await render(<RouterProvider router={router} />);

    await expect
      .poll(() =>
        page
          .getByRole("navigation", { name: "Nos villes" })
          .getByRole("link")
          .elements()
          .map((link) => [link.textContent, link.getAttribute("href")]),
      )
      .toEqual(
        TARGET_CITIES.map((city) => [city.name, `/immobilier/${city.slug}`]),
      );
  });
});
