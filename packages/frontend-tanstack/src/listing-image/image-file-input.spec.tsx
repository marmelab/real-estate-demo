import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ImageFileInput } from "./image-file-input.tsx";

const photo = new File(["png"], "facade.png", { type: "image/png" });

async function uploadPhoto(
  file: File,
  onUpload: (file: File) => Promise<void>,
) {
  await render(
    <ImageFileInput label="Ajouter une photo" onUpload={onUpload} />,
  );
  await page.getByLabelText("Ajouter une photo").upload(file);
}

describe("ImageFileInput", () => {
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
    const onUpload = vi.fn();

    await uploadPhoto(file, onUpload);

    await expect.element(page.getByText(message)).toBeVisible();
    expect(onUpload).not.toHaveBeenCalled();
  });

  it("should upload a valid image", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);

    await uploadPhoto(photo, onUpload);

    await expect
      .poll(() => onUpload.mock.lastCall?.[0].name)
      .toBe("facade.png");
  });

  it("should show an alert when the upload fails", async () => {
    await uploadPhoto(photo, vi.fn().mockRejectedValue(new Error("network")));

    await expect
      .element(page.getByText("L'envoi de la photo a échoué"))
      .toBeVisible();
  });
});
