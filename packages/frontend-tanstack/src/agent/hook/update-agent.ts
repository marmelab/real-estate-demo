import type { AgentInput } from "@remix-v3-demo/domain/agent/agent-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { agentInputSchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { updateAgent } from "@remix-v3-demo/domain/agent/update-agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { rethrowInsufficientPrivilege } from "../../supabase/insufficient-privilege.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const updateAgentFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.uuid(), input: agentInputSchema }))
  .handler(({ data }) =>
    updateAgent(createSessionClient(), data.id, data.input).catch(
      rethrowInsufficientPrivilege,
    ),
  );

export function useUpdateAgent(
  id: string,
): UseMutationResult<void, Error, AgentInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AgentInput) => updateAgentFn({ data: { id, input } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
