import type { SetPassword } from "@remix-v3-demo/domain/auth/auth-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { setPasswordSchema } from "@remix-v3-demo/domain/auth/auth-validator";
import { setPassword } from "@remix-v3-demo/domain/auth/set-password";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";

const setPasswordFn = createServerFn({ method: "POST" })
  .validator(setPasswordSchema)
  .handler(({ data }) => setPassword(createSessionClient(), data.password));

export function useSetPassword(): UseMutationResult<void, Error, SetPassword> {
  return useMutation({
    mutationFn: (input: SetPassword) => setPasswordFn({ data: input }),
  });
}
