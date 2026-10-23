import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { SelectField } from "./select-field.tsx";
import { TextField } from "./text-field.tsx";

function describedText(field: HTMLElement | null) {
  return (field?.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent);
}

describe("form fields", () => {
  for (let isRequired of [true, false]) {
    it(`marks the label of a ${isRequired ? "required" : "optional"} field`, (t) => {
      let { $, cleanup } = render(
        <TextField label="Titre" name="title" isRequired={isRequired} />,
      );
      t.after(cleanup);

      assert.equal($("label")?.textContent, isRequired ? "Titre *" : "Titre");
    });
  }

  it("flags an invalid field and describes it with its error", (t) => {
    let { $, cleanup } = render(
      <TextField label="Titre" name="title" error="Champ requis" />,
    );
    t.after(cleanup);
    let input = $("input");

    assert.equal(input?.getAttribute("aria-invalid"), "true");
    assert.deepEqual(describedText(input), ["Champ requis"]);
  });

  it("describes a field with its hint then its error", (t) => {
    let { $, cleanup } = render(
      <TextField
        label="Prix (€)"
        name="price"
        hint="Prix de vente en euros, sans espaces."
        error="Nombre attendu"
      />,
    );
    t.after(cleanup);

    assert.deepEqual(describedText($("input")), [
      "Prix de vente en euros, sans espaces.",
      "Nombre attendu",
    ]);
  });

  it("offers the empty option of a select first, selected without a value", (t) => {
    let { $, $$, cleanup } = render(
      <SelectField
        label="Ville"
        name="city"
        value=""
        options={[["Lyon", "Lyon"]]}
        emptyLabel="Choisir"
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      {
        options: [...$$("option")].map((option) => option.textContent),
        value: ($("select") as HTMLSelectElement).value,
      },
      { options: ["Choisir", "Lyon"], value: "" },
    );
  });
});
