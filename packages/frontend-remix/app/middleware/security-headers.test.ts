import * as assert from "remix/assert";
import { describe, it, type TestContext } from "remix/test";

import { scriptEntry } from "#assets";

import { router } from "../router.ts";

const EXPECTED_SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function setEnv(env: Record<string, string | undefined>) {
  for (let [name, value] of Object.entries(env)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
}

function useEnv(t: TestContext, env: Record<string, string | undefined>) {
  let saved = Object.fromEntries(
    Object.keys(env).map((name) => [name, process.env[name]]),
  );
  setEnv(env);
  t.after(() => setEnv(saved));
}

async function fetchHome() {
  let response = await router.fetch("http://localhost/");
  let csp = response.headers.get("Content-Security-Policy") ?? "";
  let nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
  return { body: await response.text(), csp, nonce };
}

describe("security headers", () => {
  for (let path of ["/", "/robots.txt", scriptEntry.href]) {
    it(`GET ${path} carries the security headers`, async () => {
      let response = await router.fetch(new URL(path, "http://localhost"));

      assert.deepEqual(
        Object.fromEntries(
          Object.keys(EXPECTED_SECURITY_HEADERS).map((name) => [
            name,
            response.headers.get(name),
          ]),
        ),
        EXPECTED_SECURITY_HEADERS,
      );
    });
  }

  it("in production, GET / sets a fresh per-request nonce CSP on every script", async (t) => {
    useEnv(t, { NODE_ENV: "production", SUPABASE_URL: undefined });

    let first = await fetchHome();
    let second = await fetchHome();

    assert.equal(
      first.csp,
      `default-src 'self'; script-src 'self' 'nonce-${first.nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'`,
    );
    let scriptNonces = [...first.body.matchAll(/<script\b[^>]*>/g)]
      .filter(([tag]) => !tag.includes('type="application/json"'))
      .map(([tag]) => /\snonce="([^"]*)"/.exec(tag)?.[1]);
    assert.ok(scriptNonces.length > 0);
    assert.deepEqual(
      scriptNonces,
      scriptNonces.map(() => first.nonce),
    );
    assert.notEqual(first.nonce, second.nonce);
  });

  it("in production, the CSP allows connecting to the Supabase origin", async (t) => {
    useEnv(t, {
      NODE_ENV: "production",
      SUPABASE_URL: "https://x.supabase.co/rest/v1",
    });

    let { csp } = await fetchHome();

    assert.match(csp, /; connect-src 'self' https:\/\/x\.supabase\.co;/);
  });
});
