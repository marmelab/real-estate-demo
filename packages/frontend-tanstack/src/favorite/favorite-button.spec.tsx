import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { FavoriteButton } from "./favorite-button.tsx";
import { FavoriteCount } from "./favorite-count.tsx";

async function renderButtonAndCount() {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <>
          <FavoriteCount />
          <FavoriteButton listingId={7} />
        </>
      ),
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

describe("FavoriteButton", () => {
  beforeEach(() => {
    document.cookie = "favorites=; Path=/; Max-Age=0";
  });

  it("should toggle the listing and update the favorites count", async () => {
    await renderButtonAndCount();
    const button = page.getByRole("button", { name: "Ajouter aux favoris" });
    const count = page.getByRole("link", { name: /Favoris/ });

    await button.click();
    await expect.element(button).toHaveAttribute("aria-pressed", "true");
    await expect.element(count).toHaveTextContent("Favoris1");

    await button.click();
    await expect.element(button).toHaveAttribute("aria-pressed", "false");
    await expect.element(count).toHaveTextContent("Favoris0");
  });
});
