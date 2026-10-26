import type { ListingImage } from "@remix-v3-demo/domain/listing/model";

import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingGallery } from "./listing-gallery.tsx";

const images: ListingImage[] = [1, 2, 3].map((id) => ({
  url: `/${id}.jpg`,
  mobileUrl: `/${id}-mobile.jpg`,
  alt: `Photo ${id}`,
}));

const trackLayout = document.createElement("style");
trackLayout.textContent = `
  [aria-roledescription="carrousel"] ul { display: flex; overflow-x: auto; width: 400px; }
  [aria-roledescription="carrousel"] li { flex-shrink: 0; width: 100%; height: 10px; }
`;

describe("ListingGallery", () => {
  beforeAll(() => {
    document.head.append(trackLayout);
  });

  afterAll(() => {
    trackLayout.remove();
  });

  it("should show the placeholder when the listing has no photo", async () => {
    await render(<ListingGallery images={[]} />);

    await expect.element(page.getByText("Photos sur demande")).toBeVisible();
    await expect
      .element(page.getByRole("region", { name: "Photos du bien" }))
      .not.toBeInTheDocument();
  });

  it("should not offer to browse a single photo", async () => {
    await render(<ListingGallery images={images.slice(0, 1)} />);

    await expect
      .element(page.getByRole("img", { name: "Photo 1" }))
      .toBeInTheDocument();
    await expect.element(page.getByRole("button")).not.toBeInTheDocument();
  });

  it("should not go back from the first photo", async () => {
    await render(<ListingGallery images={images} />);

    await expect
      .element(page.getByRole("button", { name: "Photo précédente" }))
      .toBeDisabled();
    await expect.element(page.getByText("1 / 3")).toBeInTheDocument();
  });

  it("should move to the next photo", async () => {
    await render(<ListingGallery images={images} />);

    await page.getByRole("button", { name: "Photo suivante" }).click();

    await expect.element(page.getByText("2 / 3")).toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Photo précédente" }))
      .toBeEnabled();
  });
});
