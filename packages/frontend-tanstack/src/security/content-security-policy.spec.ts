import { buildContentSecurityPolicy } from "./content-security-policy.ts";

describe("buildContentSecurityPolicy", () => {
  it.each([
    [
      "https://x.supabase.co/rest/v1",
      "img-src 'self' data: https: https://x.supabase.co",
      "connect-src 'self' https://x.supabase.co",
    ],
    [undefined, "img-src 'self' data: https:", "connect-src 'self'"],
  ])(
    "should allow scripts by nonce, and images and connections from the Supabase origin of %s",
    (supabaseUrl, imgSrc, connectSrc) => {
      expect(buildContentSecurityPolicy("abc123", supabaseUrl)).toEqual(
        [
          "default-src 'self'",
          "script-src 'self' 'nonce-abc123'",
          "style-src 'self' 'unsafe-inline'",
          imgSrc,
          connectSrc,
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join("; "),
      );
    },
  );
});
