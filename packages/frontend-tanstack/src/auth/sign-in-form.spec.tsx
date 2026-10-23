import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { SignInForm } from "./sign-in-form.tsx";

describe("SignInForm", () => {
  it("should show an error on each empty field without signing in", async () => {
    const onSubmit = vi.fn();
    await render(<SignInForm onSubmit={onSubmit} />);

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect
      .element(page.getByLabelText("E-mail *"))
      .toHaveAccessibleDescription("Champ requis");
    await expect
      .element(page.getByLabelText("Mot de passe *"))
      .toHaveAccessibleDescription("Champ requis");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should show invalid credentials when the sign-in is rejected", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Invalid login"));
    await render(<SignInForm onSubmit={onSubmit} />);

    await page.getByLabelText("E-mail *").fill("agent@example.com");
    await page.getByLabelText("Mot de passe *").fill("wrong");
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect
      .element(page.getByText("Identifiants invalides"))
      .toBeVisible();
    expect(onSubmit).toHaveBeenCalledWith({
      email: "agent@example.com",
      password: "wrong",
    });
  });
});
