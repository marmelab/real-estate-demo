import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { z } from "zod";

import { useAppForm } from "./app-form.tsx";
import { validateWith } from "./validate-with.ts";

function Fields({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const form = useAppForm({
    defaultValues: { title: "", city: "" },
    validators: {
      onSubmit: validateWith(z.object({ title: z.string().min(1) })),
    },
    onSubmit,
  });
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="title">
        {(field) => (
          <field.TextField
            label="Titre"
            hint="Visible sur l'annonce"
            isRequired
          />
        )}
      </form.AppField>
      <form.AppField name="city">
        {(field) => (
          <field.SelectField
            label="Ville"
            options={[["Lyon", "Lyon"]]}
            emptyLabel="Toutes les villes"
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton label="Enregistrer" />
      </form.AppForm>
    </form>
  );
}

async function renderFields(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  await render(<Fields onSubmit={onSubmit} />);
  return onSubmit;
}

describe("form fields", () => {
  it("should star only the required labels", async () => {
    await renderFields();

    await expect
      .element(page.getByLabelText("Titre *", { exact: true }))
      .toBeVisible();
    await expect
      .element(page.getByLabelText("Ville", { exact: true }))
      .toBeVisible();
  });

  it("should describe a field by its hint", async () => {
    await renderFields();

    await expect
      .element(page.getByLabelText("Titre *"))
      .toHaveAccessibleDescription("Visible sur l'annonce");
    await expect
      .element(page.getByLabelText("Titre *"))
      .not.toHaveAttribute("aria-invalid");
  });

  it("should flag an invalid field and describe it by its hint and error", async () => {
    const onSubmit = await renderFields();

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByLabelText("Titre *"))
      .toHaveAttribute("aria-invalid", "true");
    await expect
      .element(page.getByLabelText("Titre *"))
      .toHaveAccessibleDescription("Visible sur l'annonce Champ requis");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should offer the empty label as a blank option", async () => {
    await renderFields();

    await expect
      .element(page.getByLabelText("Ville"))
      .toHaveDisplayValue("Toutes les villes");
    await expect.element(page.getByLabelText("Ville")).toHaveValue("");
  });

  it("should disable the submit button while submitting", async () => {
    const { promise, resolve } = Promise.withResolvers<void>();
    await renderFields(vi.fn().mockReturnValue(promise));
    await page.getByLabelText("Titre *").fill("Villa Belle Époque");

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect
      .element(page.getByRole("button", { name: "Enregistrer" }))
      .toBeDisabled();
    resolve();
    await expect
      .element(page.getByRole("button", { name: "Enregistrer" }))
      .toBeEnabled();
  });
});
