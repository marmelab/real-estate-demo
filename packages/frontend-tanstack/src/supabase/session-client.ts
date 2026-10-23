import type { SupabaseClient } from "@supabase/supabase-js";

import { createServerClient } from "@supabase/ssr";
import { createServerOnlyFn } from "@tanstack/react-start";
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";

import { requireEnv } from "./require-env.ts";

export const createSessionClient = createServerOnlyFn((): SupabaseClient => {
  setResponseHeader("Cache-Control", "private, no-store");
  return createServerClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll: () =>
          Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          })),
        setAll: (cookies, headers) => {
          for (const { name, value, options } of cookies) {
            setCookie(name, value, options);
          }
          for (const [name, value] of Object.entries(headers)) {
            setResponseHeader(name, value);
          }
        },
      },
    },
  );
});
