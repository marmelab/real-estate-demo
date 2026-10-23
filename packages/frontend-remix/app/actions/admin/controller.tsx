import { signOut } from "@remix-v3-demo/domain/auth/sign-out";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import { supabaseSession } from "../../middleware/supabase-session.ts";
import { routes } from "../../routes.ts";

export default createController(routes.admin, {
  middleware: [supabaseSession()],
  actions: {
    index() {
      return redirect(routes.admin.listings.index.href());
    },
    async logout(context) {
      await signOut(context.supabase);
      return redirect(routes.admin.login.index.href(), 303);
    },
  },
});
