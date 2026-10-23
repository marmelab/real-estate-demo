import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { SignInForm } from "./sign-in-form.tsx";

describe("SignInForm", () => {
  it("posts the required email and password to its action", (t) => {
    let { $, $$, cleanup } = render(
      <SignInForm action="/admin/login?redirectTo=%2Fadmin" />,
    );
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
        action: "/admin/login?redirectTo=%2Fadmin",
        fields: [
          ["email", "email"],
          ["password", "password"],
        ],
        labels: ["E-mail *", "Mot de passe *"],
      },
    );
  });

  it("announces the sign-in error", (t) => {
    let { $, cleanup } = render(
      <SignInForm action="/admin/login" error="Identifiants invalides" />,
    );
    t.after(cleanup);

    assert.equal(
      $('[aria-live="polite"]')?.textContent,
      "Identifiants invalides",
    );
  });
});
