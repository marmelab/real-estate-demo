import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { InviteFromHash } from "./invite-from-hash.tsx";

const setSession = vi.hoisted(() => vi.fn());

vi.mock("./hook/set-session.ts", async () => {
  const { useMutation } = await import("@tanstack/react-query");
  return {
    useSetSession: () => useMutation({ mutationFn: setSession }),
  };
});

const initialUrl = window.location.href;

async function renderInvite(hash: string) {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${hash}`,
  );
  await render(
    <QueryClientProvider client={new QueryClient()}>
      <InviteFromHash
        verified={<p>Invitation vérifiée</p>}
        invalid={<p>Invitation invalide</p>}
      />
    </QueryClientProvider>,
  );
}

describe("InviteFromHash", () => {
  beforeEach(() => {
    setSession.mockReset();
  });

  afterEach(() => {
    window.history.replaceState(null, "", initialUrl);
  });

  it("should reject an invite link without tokens", async () => {
    await renderInvite("#error=access_denied");

    await expect.element(page.getByText("Invitation invalide")).toBeVisible();
    expect(setSession).not.toHaveBeenCalled();
  });

  it("should open the session and strip the tokens from the URL", async () => {
    setSession.mockResolvedValue(undefined);

    await renderInvite("#access_token=access&refresh_token=refresh");

    await expect.element(page.getByText("Invitation vérifiée")).toBeVisible();
    expect(setSession.mock.calls[0]?.[0]).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
    });
    expect(window.location.hash).toBe("");
  });

  it("should reject an invite whose tokens fail to open a session", async () => {
    setSession.mockRejectedValue(new Error("expired"));

    await renderInvite("#access_token=access&refresh_token=refresh");

    await expect.element(page.getByText("Invitation invalide")).toBeVisible();
  });
});
