import { buildContentSecurityPolicy } from "./content-security-policy.ts";

describe("buildContentSecurityPolicy", () => {
  it.each([
    [
      "https://x.supabase.co/rest/v1",
      "connect-src 'self' https://x.supabase.co",
    ],
    [undefined, "connect-src 'self'"],
  ])(
    "should allow scripts by nonce and connections to the Supabase origin of %s",
    (supabaseUrl, connectSrc) => {
      expect(buildContentSecurityPolicy("abc123", supabaseUrl)).toEqual(
        [
          "default-src 'self'",
          "script-src 'self' 'nonce-abc123'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          connectSrc,
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join("; "),
      );
    },
  );
});
