import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it, type TestContext } from "remix/test";

import { ShowModal } from "./show-modal.tsx";

function appendToBody(t: TestContext, html: string) {
  let element = document.createElement("template");
  element.innerHTML = html;
  let target = element.content.firstElementChild as HTMLElement;
  document.body.append(target);
  t.after(() => target.remove());
  return target;
}

describe("ShowModal", () => {
  it("opens the dialog with the given id as a modal", (t) => {
    let dialog = appendToBody(t, '<dialog id="target"></dialog>');

    let { cleanup } = render(<ShowModal dialogId="target" />);
    t.after(cleanup);

    assert.equal(dialog.matches(":modal"), true);
  });

  for (let [label, html] of [
    ["an already open dialog", '<dialog id="target" open></dialog>'],
    ["an element that is not a dialog", '<div id="target"></div>'],
  ] as const) {
    it(`ignores ${label}`, (t) => {
      let target = appendToBody(t, html);
      let consoleError = t.mock.method(console, "error");

      let { cleanup } = render(<ShowModal dialogId="target" />);
      t.after(cleanup);

      assert.equal(consoleError.mock.calls.length, 0);
      assert.equal(target.matches(":modal"), false);
    });
  }
});
