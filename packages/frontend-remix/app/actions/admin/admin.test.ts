import * as assert from "remix/assert";
import { describe, it, type TestContext } from "remix/test";

import { router } from "../../router.ts";
import { routes } from "../../routes.ts";

function useSupabaseEnv(t: TestContext) {
  let saved = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  };
  process.env.SUPABASE_URL = "http://supabase.test";
  process.env.SUPABASE_PUBLISHABLE_KEY = "publishable-key";
  t.after(() => Object.assign(process.env, saved));
}

function fetchPath(path: string, init?: RequestInit) {
  return router.fetch(new Request(new URL(path, "http://localhost"), init));
}

describe("admin auth", () => {
  it("sends a visitor to the login page, back to the page asked", async (t) => {
    useSupabaseEnv(t);

    let response = await fetchPath("/admin/listings?page=2");

    assert.equal(response.status, 302);
    assert.equal(
      response.headers.get("Location"),
      "/admin/login?redirect=%2Fadmin%2Flistings%3Fpage%3D2",
    );
  });

  let redirectCases: [string, string][] = [
    ["/admin/agents?page=2", "%2Fadmin%2Fagents%3Fpage%3D2"],
    ["https://evil.example/admin", "%2Fadmin%2Flistings"],
  ];
  for (let [target, expected] of redirectCases) {
    it(`signs in back to an admin page only, here ${target}`, async (t) => {
      useSupabaseEnv(t);

      let response = await fetchPath(
        routes.admin.login.index.href(undefined, {
          searchParams: { redirect: target },
        }),
      );

      assert.match(
        await response.text(),
        new RegExp(`action="/admin/login\\?redirect=${expected}"`),
      );
    });
  }

  it("shows an error on each empty field without signing in", async (t) => {
    useSupabaseEnv(t);

    let response = await fetchPath(routes.admin.login.action.href(), {
      method: "POST",
      body: new URLSearchParams({ email: "", password: "" }),
    });
    let html = await response.text();

    assert.equal(response.status, 400);
    assert.equal(html.match(/>Champ requis</g)?.length, 2);
    assert.equal(response.headers.getSetCookie().length, 0);
  });
});
