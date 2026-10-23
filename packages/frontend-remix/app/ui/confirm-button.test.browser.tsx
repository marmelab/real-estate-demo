import * as assert from "remix/assert";
import { on } from "remix/component";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ConfirmButton } from "./confirm-button.tsx";

function renderInForm() {
  let submitted: FormData[] = [];
  let result = render(
    <form
      mix={on("submit", (event) => {
        event.preventDefault();
        submitted.push(new FormData(event.currentTarget, event.submitter));
      })}
    >
      <ConfirmButton
        label="Retirer l'agent"
        title="Retirer cet agent ?"
        message="Il n'aura plus accès à l'espace agents."
        confirmLabel="Retirer"
        class="button-ghost"
        submitter={{ name: "_method", value: "DELETE" }}
      />
    </form>,
  );
  return { ...result, submitted };
}

describe("ConfirmButton", () => {
  it("opens the confirmation dialog on click", async (t) => {
    let { $, act, cleanup } = renderInForm();
    t.after(cleanup);

    await act(() => $('button[command="show-modal"]')?.click());

    assert.equal($("dialog")?.matches(":modal"), true);
  });

  it("submits its submitter name and value on confirm", async (t) => {
    let { $, act, cleanup, submitted } = renderInForm();
    t.after(cleanup);

    await act(() => {
      $('button[command="show-modal"]')?.click();
      $('dialog button[type="submit"]')?.click();
    });

    assert.deepEqual(
      submitted.map((data) => data.get("_method")),
      ["DELETE"],
    );
  });
});
