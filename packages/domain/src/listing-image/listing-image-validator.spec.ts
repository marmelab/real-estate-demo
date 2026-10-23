import { listingImageFileSchema } from "./listing-image-validator.ts";

const MB = 1024 * 1024;

describe("listingImageFileSchema", () => {
  it("should accept a small webp image", () => {
    const file = new File([new Uint8Array(10)], "photo.webp", {
      type: "image/webp",
    });

    expect(listingImageFileSchema.safeParse(file).success).toBe(true);
  });

  it.each([
    [
      "a gif",
      new File([new Uint8Array(10)], "photo.gif", { type: "image/gif" }),
    ],
    [
      "a 6 MB file",
      new File([new Uint8Array(6 * MB)], "photo.png", { type: "image/png" }),
    ],
  ])("should reject %s", (_label, file) => {
    expect(listingImageFileSchema.safeParse(file).success).toBe(false);
  });
});
