import type { Mock } from "vitest";

import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { AgentForm } from "./agent-form.tsx";

const agent = {
  firstName: "Claire",
  lastName: "Martin",
  role: "manager",
} as const;

async function renderForm({
  canChangeRole = false,
  onSubmit = vi.fn().mockResolvedValue(undefined),
  onRemove,
}: {
  canChangeRole?: boolean;
  onSubmit?: Mock<() => Promise<void>>;
  onRemove?: () => Promise<void>;
} = {}) {
  await render(
    <AgentForm
      agent={agent}
      canChangeRole={canChangeRole}
      onSubmit={onSubmit}
      onRemove={onRemove}
    />,
  );
  return onSubmit;
}

describe("AgentForm", () => {
  it("should show an error on each empty name without saving", async () => {
    const onSubmit = await renderForm();
    await page.getByLabelText("Prénom *").fill("");
    await page.getByLabelText("Nom *").fill("");

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByLabelText("Prénom *"))
      .toHaveAccessibleDescription("Champ requis");
    await expect
      .element(page.getByLabelText("Nom *"))
      .toHaveAccessibleDescription("Champ requis");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should save the picked role when the role can change", async () => {
    const onSubmit = await renderForm({ canChangeRole: true });

    await page.getByRole("combobox", { name: "Rôle" }).selectOptions("Agent");
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .poll(() => onSubmit.mock.calls)
      .toEqual([[{ firstName: "Claire", lastName: "Martin", role: "agent" }]]);
  });

  it("should neither show nor save the role when it cannot change", async () => {
    const onSubmit = await renderForm();

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .poll(() => onSubmit.mock.calls)
      .toEqual([
        [{ firstName: "Claire", lastName: "Martin", role: undefined }],
      ]);
    await expect.element(page.getByRole("combobox")).not.toBeInTheDocument();
  });

  it("should show an alert when the save is rejected", async () => {
    await renderForm({
      onSubmit: vi.fn().mockRejectedValue(new Error("network")),
    });

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByText("Enregistrement impossible"))
      .toBeVisible();
  });

  it("should remove the agent only once confirmed", async () => {
    const onRemove = vi.fn().mockResolvedValue(undefined);
    await renderForm({ onRemove });

    await page.getByRole("button", { name: "Retirer l'agent" }).click();
    expect(onRemove).not.toHaveBeenCalled();
    await page.getByRole("button", { name: "Retirer", exact: true }).click();

    await expect.poll(() => onRemove.mock.calls).toEqual([[]]);
  });
});
