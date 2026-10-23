import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { UseSuspenseQueryResult } from "@tanstack/react-query";

import { getAgentById } from "@remix-v3-demo/domain/agent/get-agent-by-id";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createSessionClient } from "../../supabase/session-client.ts";

const getAgentByIdFn = createServerFn({ method: "GET" })
  .validator(z.uuid())
  .handler(({ data }) => getAgentById(createSessionClient(), data));

export function getAgentByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["admin", "agent", id],
    queryFn: () => getAgentByIdFn({ data: id }),
  });
}

export function useGetAgentById(
  id: string,
): UseSuspenseQueryResult<Agent | null> {
  return useSuspenseQuery(getAgentByIdQueryOptions(id));
}
