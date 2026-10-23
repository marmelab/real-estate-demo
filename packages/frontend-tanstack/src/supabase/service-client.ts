import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";
import { createServerOnlyFn } from "@tanstack/react-start";

import { requireEnv } from "./require-env.ts";

export const createServiceClient = createServerOnlyFn((): SupabaseClient =>
  createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  ),
);
