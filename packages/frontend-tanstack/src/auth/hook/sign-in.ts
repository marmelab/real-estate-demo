import type { SignIn } from "@remix-v3-demo/domain/auth/auth-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { signInSchema } from "@remix-v3-demo/domain/auth/auth-validator";
import { signIn } from "@remix-v3-demo/domain/auth/sign-in";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";
import { clearStaffQueries } from "./clear-staff-queries.ts";

const signInFn = createServerFn({ method: "POST" })
  .validator(signInSchema)
  .handler(({ data }) => signIn(createSessionClient(), data));

export function useSignIn(): UseMutationResult<void, Error, SignIn> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: SignIn) => signInFn({ data: credentials }),
    onSuccess: () => clearStaffQueries(queryClient),
  });
}
