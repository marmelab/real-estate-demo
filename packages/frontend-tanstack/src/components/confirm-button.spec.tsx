import type { ReactNode } from "react";

import { Trash2 } from "lucide-react";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ConfirmButton } from "./confirm-button.tsx";

async function renderConfirmButton(icon?: ReactNode) {
  const onConfirm = vi.fn();
  await render(
    <ConfirmButton
      label="Supprimer"
      icon={icon}
      title="Supprimer l'annonce ?"
      message="Cette action est définitive."
      confirmLabel="Confirmer"
      className="button-ghost"
      onConfirm={onConfirm}
    />,
  );
  return onConfirm;
}

describe("ConfirmButton", () => {
  it("should ask for confirmation in a dialog named after its title", async () => {
    const onConfirm = await renderConfirmButton();

    await page.getByRole("button", { name: "Supprimer" }).click();

    await expect
      .element(page.getByRole("dialog", { name: "Supprimer l'annonce ?" }))
      .toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should close the dialog without confirming on cancel", async () => {
    const onConfirm = await renderConfirmButton();
    await page.getByRole("button", { name: "Supprimer" }).click();

    await page.getByRole("button", { name: "Annuler" }).click();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should close the dialog and confirm on the confirm button", async () => {
    const onConfirm = await renderConfirmButton();
    await page.getByRole("button", { name: "Supprimer" }).click();

    await page.getByRole("button", { name: "Confirmer" }).click();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("should name an icon button after its label", async () => {
    await renderConfirmButton(<Trash2 aria-hidden="true" />);

    await expect
      .element(page.getByRole("button", { name: "Supprimer" }))
      .toBeVisible();
  });
});
