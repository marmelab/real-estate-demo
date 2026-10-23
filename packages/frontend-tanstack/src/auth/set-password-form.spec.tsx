import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { SetPasswordForm } from "./set-password-form.tsx";

const PASSWORD_LABEL = "Nouveau mot de passe (8 caractères minimum) *";

async function submitPassword(onSubmit: () => Promise<void>, password: string) {
  await render(<SetPasswordForm onSubmit={onSubmit} />);
  await page.getByLabelText(PASSWORD_LABEL).fill(password);
  await page
    .getByRole("button", { name: "Enregistrer le mot de passe" })
    .click();
}

describe("SetPasswordForm", () => {
  it("should reject a password under 8 characters without saving it", async () => {
    const onSubmit = vi.fn();

    await submitPassword(onSubmit, "1234567");

    await expect
      .element(page.getByLabelText(PASSWORD_LABEL))
      .toHaveAttribute("aria-invalid", "true");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should save a password of 8 characters", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    await submitPassword(onSubmit, "12345678");

    await expect
      .poll(() => onSubmit.mock.calls)
      .toEqual([[{ password: "12345678" }]]);
  });

  it("should show an alert when the password is rejected", async () => {
    await submitPassword(
      vi.fn().mockRejectedValue(new Error("weak")),
      "12345678",
    );

    await expect
      .element(page.getByText("Le mot de passe n'a pas pu être enregistré"))
      .toBeVisible();
  });
});
