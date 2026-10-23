import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { SetPasswordForm } from "./set-password-form.tsx";

describe("SetPasswordForm", () => {
  it("posts the required new password to the accept-invite action", (t) => {
    let { $, $$, cleanup } = render(<SetPasswordForm />);
    t.after(cleanup);

    assert.deepEqual(
      {
        method: $("form")?.getAttribute("method"),
        action: $("form")?.getAttribute("action"),
        fields: [...$$("input")].map((input) => [
          input.getAttribute("name"),
          input.getAttribute("type"),
        ]),
        labels: [...$$("label")].map((label) => label.textContent),
      },
      {
        method: "post",
        action: "/admin/accept-invite",
        fields: [["password", "password"]],
        labels: ["Nouveau mot de passe (8 caractères minimum) *"],
      },
    );
  });

  it("flags the password error and announces the form error", (t) => {
    let { $, cleanup } = render(
      <SetPasswordForm
        passwordError="8 caractères minimum"
        error="Lien expiré"
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      {
        invalid: $("input")?.getAttribute("aria-invalid"),
        alert: $('[aria-live="polite"]')?.textContent,
      },
      { invalid: "true", alert: "Lien expiré" },
    );
  });
});
