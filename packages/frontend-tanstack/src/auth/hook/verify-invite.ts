import { verifyInvite } from "@remix-v3-demo/domain/auth/verify-invite";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createSessionClient } from "../../supabase/session-client.ts";

export const verifyInviteFn = createServerFn({ method: "POST" })
  .validator(z.string().min(1))
  .handler(({ data }) => verifyInvite(createSessionClient(), data));
