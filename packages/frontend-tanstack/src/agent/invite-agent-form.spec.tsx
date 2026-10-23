import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { InviteAgentForm } from "./invite-agent-form.tsx";

describe("InviteAgentForm", () => {
  it("should reject a malformed email without inviting", async () => {
    const onSubmit = vi.fn();
    await render(
      <InviteAgentForm
        onSubmit={onSubmit}
        onInvited={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await page.getByLabelText("E-mail *").fill("not-an-email");
    await page.getByLabelText("Prénom *").fill("Claire");
    await page.getByLabelText("Nom *").fill("Martin");
    await page.getByRole("button", { name: "Inviter" }).click();

    await expect
      .element(page.getByLabelText("E-mail *"))
      .toHaveAccessibleDescription(/e-mail invalide/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
