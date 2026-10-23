import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { EMPTY_INVITE, InviteAgentForm } from "./invite-agent-form.tsx";

describe("InviteAgentForm", () => {
  it("posts the invite fields to the agents action", (t) => {
    let { $, $$, cleanup } = render(
      <InviteAgentForm dialogId="invite" values={EMPTY_INVITE} />,
    );
    t.after(cleanup);

    assert.deepEqual(
      {
        method: $("form")?.getAttribute("method"),
        action: $("form")?.getAttribute("action"),
        labels: [...$$("label")].map((label) => label.textContent),
        role: ($('select[name="role"]') as HTMLSelectElement).value,
      },
      {
        method: "post",
        action: "/admin/agents",
        labels: ["E-mail *", "Prénom *", "Nom *", "Rôle"],
        role: "agent",
      },
    );
  });

  it("announces the invite error", (t) => {
    let { $, cleanup } = render(
      <InviteAgentForm
        dialogId="invite"
        values={EMPTY_INVITE}
        error="Invitation impossible"
      />,
    );
    t.after(cleanup);

    assert.equal(
      $('[aria-live="polite"]')?.textContent,
      "Invitation impossible",
    );
  });
});
