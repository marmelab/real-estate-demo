import type { UseMutationResult } from "@tanstack/react-query";

import { deleteAgent } from "@remix-v3-demo/domain/agent/delete-agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { rethrowInsufficientPrivilege } from "../../supabase/insufficient-privilege.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const deleteAgentFn = createServerFn({ method: "POST" })
  .validator(z.uuid())
  .handler(({ data }) =>
    deleteAgent(createSessionClient(), data).catch(
      rethrowInsufficientPrivilege,
    ),
  );

export function useDeleteAgent(
  id: string,
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAgentFn({ data: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
