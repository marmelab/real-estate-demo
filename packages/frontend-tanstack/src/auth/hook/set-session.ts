import type { UseMutationResult } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createSessionClient } from "../../supabase/session-client.ts";

const sessionTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});
type SessionTokens = z.infer<typeof sessionTokensSchema>;

const setSessionFn = createServerFn({ method: "POST" })
  .validator(sessionTokensSchema)
  .handler(async ({ data }) => {
    const { error } = await createSessionClient().auth.setSession({
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    });
    if (error) throw error;
  });

export function useSetSession(): UseMutationResult<void, Error, SessionTokens> {
  return useMutation({
    mutationFn: (tokens: SessionTokens) => setSessionFn({ data: tokens }),
  });
}
