import * as assert from "remix/assert";
import { on } from "remix/component";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { AltTextInput } from "./alt-text-input.tsx";

function renderInForm() {
  let submits = { count: 0 };
  let result = render(
    <form
      mix={on("submit", (event) => {
        event.preventDefault();
        submits.count++;
      })}
    >
      <AltTextInput name="alt" value="Salon" />
    </form>,
  );
  let input = result.$("input") as HTMLInputElement;
  return { ...result, input, submits };
}

describe("AltTextInput", () => {
  it("does not submit on blur when the text is unchanged", async (t) => {
    let { act, cleanup, input, submits } = renderInForm();
    t.after(cleanup);

    await act(() => {
      input.focus();
      input.blur();
    });

    assert.equal(submits.count, 0);
  });

  it("submits on blur when the text changed", async (t) => {
    let { act, cleanup, input, submits } = renderInForm();
    t.after(cleanup);

    await act(() => {
      input.focus();
      input.value = "Salon avec cheminée";
      input.blur();
    });

    assert.equal(submits.count, 1);
  });

  it("submits on Enter without its default action", async (t) => {
    let { act, cleanup, input, submits } = renderInForm();
    t.after(cleanup);
    let enter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });

    await act(() => input.dispatchEvent(enter));

    assert.deepEqual(
      { submits: submits.count, defaultPrevented: enter.defaultPrevented },
      { submits: 1, defaultPrevented: true },
    );
  });
});
