import type { AdminListingImage } from "@remix-v3-demo/domain/listing/model";

import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingPhotoManager } from "./listing-photo-manager.tsx";

const images: AdminListingImage[] = [1, 2, 3].map((id) => ({
  id,
  path: `7/${id}.jpg`,
  position: id - 1,
  alt: `Photo ${id}`,
  url: `/${id}.jpg`,
}));

async function renderManager() {
  const handlers = {
    onUpload: vi.fn().mockResolvedValue(undefined),
    onAltChange: vi.fn().mockResolvedValue(undefined),
    onReorder: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
  };
  await render(<ListingPhotoManager images={images} {...handlers} />);
  return handlers;
}

describe("ListingPhotoManager", () => {
  it("should not move the first photo up nor the last one down", async () => {
    await renderManager();
    const photos = page.getByRole("listitem");

    await expect
      .element(photos.first().getByRole("button", { name: "Monter" }))
      .toBeDisabled();
    await expect
      .element(photos.last().getByRole("button", { name: "Descendre" }))
      .toBeDisabled();
  });

  it("should swap the first two photos when moving the first one down", async () => {
    const { onReorder } = await renderManager();

    await page
      .getByRole("listitem")
      .first()
      .getByRole("button", { name: "Descendre" })
      .click();

    expect(onReorder).toHaveBeenCalledWith([2, 1, 3]);
  });

  it.each([
    [
      "a file that is not an image",
      new File(["text"], "notes.txt", { type: "text/plain" }),
      "Format accepté : JPEG, PNG ou WebP",
    ],
    [
      "an image over 5 MB",
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", {
        type: "image/jpeg",
      }),
      "La photo dépasse 5 Mo",
    ],
  ])("should refuse %s without uploading it", async (_, file, message) => {
    const { onUpload } = await renderManager();

    await page.getByLabelText("Ajouter une photo").upload(file);

    await expect.element(page.getByText(message)).toBeVisible();
    expect(onUpload).not.toHaveBeenCalled();
  });
});
