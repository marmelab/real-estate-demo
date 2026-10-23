import type { Staff } from "@remix-v3-demo/domain/auth/model";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getCurrentStaff } from "@remix-v3-demo/domain/auth/get-current-staff";
import { redirect } from "remix/response/redirect";
import { createContextKey, type Middleware } from "remix/router";

import type { AppContext } from "../router.ts";

import { routes } from "../routes.ts";
import { Supabase } from "./supabase-session.ts";

export const CurrentStaff = createContextKey<Staff>();

export type PageContext = Pick<AppContext, "render" | "nonce" | "url">;

export type StaffContext = PageContext & {
  supabase: SupabaseClient;
  staff: Staff;
};

export function requireStaff(): Middleware<{
  key: typeof CurrentStaff;
  value: Staff;
  property: "staff";
}> {
  return async (context, next) => {
    let supabase = context.get(Supabase);
    if (!supabase) throw new Error("requireStaff() needs supabaseSession()");
    let staff = await getCurrentStaff(supabase).catch(() => null);
    if (!staff) {
      return redirect(
        routes.admin.login.index.href(undefined, {
          searchParams: { redirect: context.url.pathname + context.url.search },
        }),
      );
    }
    context.set(CurrentStaff, staff, { property: "staff" });
    return next();
  };
}

export function requireManager(): Middleware {
  return (context, next) =>
    context.get(CurrentStaff)?.role === "manager"
      ? next()
      : Promise.resolve(redirect(routes.admin.listings.index.href()));
}
