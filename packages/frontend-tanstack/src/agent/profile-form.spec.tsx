import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ProfileForm } from "./profile-form.tsx";

const staff = {
  firstName: "Claire",
  lastName: "Martin",
  role: "agent",
  photoUrl: null,
} as const;

async function renderProfile(photoUrl: string | null) {
  const onPhotoUpload = vi.fn().mockResolvedValue(undefined);
  await render(
    <ProfileForm
      staff={{ ...staff, photoUrl }}
      onSubmit={vi.fn()}
      onPhotoUpload={onPhotoUpload}
    />,
  );
  return onPhotoUpload;
}

describe("ProfileForm", () => {
  it("should show the staff photo", async () => {
    await renderProfile("/claire.jpg");

    await expect
      .element(page.getByRole("img", { name: "Claire Martin" }))
      .toHaveAttribute("src", "/claire.jpg");
  });

  it("should say so when the staff has no photo", async () => {
    await renderProfile(null);

    await expect
      .element(page.getByText("Aucune photo pour l'instant."))
      .toBeVisible();
  });

  it("should not let the staff change their own role", async () => {
    await renderProfile(null);

    await expect.element(page.getByLabelText("Prénom *")).toBeVisible();
    await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
  });

  it("should upload the chosen photo", async () => {
    const onPhotoUpload = await renderProfile(null);

    await page
      .getByLabelText("Changer de photo")
      .upload(new File(["png"], "claire.png", { type: "image/png" }));

    await expect
      .poll(() => onPhotoUpload.mock.lastCall?.[0].name)
      .toBe("claire.png");
  });
});
