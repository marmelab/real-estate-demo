import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import type { ListingFormProps } from "./listing-form.tsx";

import { toFormValues } from "./listing-form-values.ts";
import { ListingForm } from "./listing-form.tsx";

function props(overrides: Partial<ListingFormProps> = {}): ListingFormProps {
  return {
    title: "Nouvelle annonce",
    action: "/admin/listings/new",
    values: toFormValues(),
    agents: [],
    isManager: true,
    tab: "general",
    ...overrides,
  };
}

function checkedTab(root: ParentNode) {
  return root.querySelector<HTMLInputElement>(
    'input[name="listing-tab"]:checked',
  )?.value;
}

describe("ListingForm", () => {
  for (let isManager of [true, false]) {
    it(`shows the publish checkbox only to managers, here ${isManager}`, (t) => {
      let { $, cleanup } = render(<ListingForm {...props({ isManager })} />);
      t.after(cleanup);

      assert.equal($('[name="published"]') !== null, isManager);
    });
  }

  it("switches the section from its tab", async (t) => {
    let { container, $$, act, cleanup } = render(<ListingForm {...props()} />);
    t.after(cleanup);
    let details = [...$$("label")].find(
      (label) => label.textContent === "Caractéristiques",
    );

    await act(() => details?.click());

    assert.equal(checkedTab(container), "details");
  });

  it("flags the tab holding an invalid field", (t) => {
    let { $$, cleanup } = render(
      <ListingForm
        {...props({ errors: { postalCode: "Code postal invalide" } })}
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$("fieldset label")].map((label) => label.textContent),
      ["Général", "Caractéristiques", "Localisation(erreurs)"],
    );
  });

  for (let [isManager, canDelete] of [
    [true, true],
    [true, false],
    [false, true],
  ]) {
    it(`offers deletion only to a manager on a deletable listing, here manager ${isManager} and deletable ${canDelete}`, (t) => {
      let { $, cleanup } = render(
        <ListingForm {...props({ isManager, canDelete })} />,
      );
      t.after(cleanup);

      assert.equal(
        $('button[command="show-modal"]') !== null,
        isManager && canDelete,
      );
    });
  }

  it("fills the city from a target city postal code", async (t) => {
    let { $, act, cleanup } = render(<ListingForm {...props()} />);
    t.after(cleanup);
    let postalCode = $('input[name="postalCode"]') as HTMLInputElement;

    await act(() => {
      postalCode.value = "69003";
      postalCode.dispatchEvent(new Event("input", { bubbles: true }));
    });

    assert.equal(($('select[name="city"]') as HTMLSelectElement).value, "Lyon");
  });
});
