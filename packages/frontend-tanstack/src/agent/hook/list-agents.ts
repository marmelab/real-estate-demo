import type { ListAgentsQuery } from "@remix-v3-demo/domain/agent/agent-validator";
import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { listAgentsQuerySchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { listAgents } from "@remix-v3-demo/domain/agent/list-agents";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";

const listAgentsFn = createServerFn({ method: "GET" })
  .validator(listAgentsQuerySchema)
  .handler(({ data }) => listAgents(createSessionClient(), data));

export function listAgentsQueryOptions(query: ListAgentsQuery) {
  return queryOptions({
    queryKey: ["admin", "agents", query],
    queryFn: () => listAgentsFn({ data: query }),
  });
}

export function useListAgents(
  query: ListAgentsQuery,
): UseSuspenseQueryResult<{ agents: Agent[]; total: number }> {
  return useSuspenseQuery(listAgentsQueryOptions(query));
}
