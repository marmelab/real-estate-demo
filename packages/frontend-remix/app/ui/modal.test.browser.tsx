import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { Modal } from "./modal.tsx";

describe("Modal", () => {
  for (let isOpen of [true, false]) {
    it(`renders the dialog ${isOpen ? "open" : "closed"} from isOpen`, (t) => {
      let { $, cleanup } = render(
        <Modal id="invite" title="Inviter un agent" isOpen={isOpen}>
          <p>Contenu</p>
        </Modal>,
      );
      t.after(cleanup);

      assert.equal($("dialog")?.matches(":modal"), isOpen);
    });
  }
});
