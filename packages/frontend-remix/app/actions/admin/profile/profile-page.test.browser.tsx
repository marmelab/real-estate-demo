import type { Staff } from "@remix-v3-demo/domain/auth/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ProfilePage } from "./profile-page.tsx";

const staff: Staff = {
  id: "8f6c2a4e-3b1d-4c5e-9a7f-1d2e3f4a5b6c",
  firstName: "Claire",
  lastName: "Martin",
  role: "manager",
  photoUrl: null,
};

describe("ProfilePage", () => {
  for (let photoUrl of ["/claire.jpg", null]) {
    it(`shows the photo or its absence, here ${photoUrl ?? "none"}`, (t) => {
      let { $, cleanup } = render(
        <ProfilePage staff={{ ...staff, photoUrl }} />,
      );
      t.after(cleanup);

      assert.deepEqual(
        {
          photo: $("img")?.getAttribute("src") ?? null,
          empty: $("section p")?.textContent === "Aucune photo pour l'instant.",
        },
        { photo: photoUrl, empty: photoUrl === null },
      );
    });
  }

  it("uploads the photo and posts the names without a role", (t) => {
    let { $$, cleanup } = render(<ProfilePage staff={staff} />);
    t.after(cleanup);

    assert.deepEqual(
      [...$$("form")].map((form) => ({
        action: form.getAttribute("action"),
        enctype: form.getAttribute("enctype"),
        fields: [...form.querySelectorAll("input, select")].map((field) =>
          field.getAttribute("name"),
        ),
      })),
      [
        {
          action: "/admin/profile/photo",
          enctype: "multipart/form-data",
          fields: ["file"],
        },
        {
          action: "/admin/profile",
          enctype: null,
          fields: ["firstName", "lastName"],
        },
      ],
    );
  });

  it("announces the photo and names errors", (t) => {
    let { $$, cleanup } = render(
      <ProfilePage
        staff={staff}
        photoError="Format non pris en charge"
        error="Enregistrement impossible"
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$('[aria-live="polite"]')].map((alert) => alert.textContent),
      ["Format non pris en charge", "Enregistrement impossible"],
    );
  });
});
