import type { UseMutationResult } from "@tanstack/react-query";

import { signOut } from "@remix-v3-demo/domain/auth/sign-out";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";
import { clearStaffQueries } from "./clear-staff-queries.ts";

const signOutFn = createServerFn({ method: "POST" }).handler(() =>
  signOut(createSessionClient()),
);

export function useSignOut(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => signOutFn(),
    onSuccess: () => clearStaffQueries(queryClient),
  });
}
