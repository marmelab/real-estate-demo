import type { InviteAgent } from "@remix-v3-demo/domain/agent/agent-validator";
import type { UseMutationResult } from "@tanstack/react-query";

import { inviteAgentSchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { inviteAgent } from "@remix-v3-demo/domain/agent/invite-agent";
import { getCurrentStaff } from "@remix-v3-demo/domain/auth/get-current-staff";
import { INSUFFICIENT_PRIVILEGE_MESSAGE } from "@remix-v3-demo/domain/auth/insufficient-privilege";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { createServiceClient } from "../../supabase/service-client.ts";
import { createSessionClient } from "../../supabase/session-client.ts";

const inviteAgentFn = createServerFn({ method: "POST" })
  .validator(inviteAgentSchema)
  .handler(async ({ data }) => {
    const staff = await getCurrentStaff(createSessionClient());
    if (staff?.role !== "manager") {
      throw new Error(INSUFFICIENT_PRIVILEGE_MESSAGE);
    }
    const { origin } = new URL(getRequest().url);
    await inviteAgent(
      createServiceClient(),
      data,
      `${origin}/admin/accept-invite`,
    );
  });

export function useInviteAgent(): UseMutationResult<void, Error, InviteAgent> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invite: InviteAgent) => inviteAgentFn({ data: invite }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
