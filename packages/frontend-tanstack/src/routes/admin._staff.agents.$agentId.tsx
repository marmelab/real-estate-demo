import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { AgentForm } from "../agent/agent-form.tsx";
import { useDeleteAgent } from "../agent/hook/delete-agent.ts";
import {
  getAgentByIdQueryOptions,
  useGetAgentById,
} from "../agent/hook/get-agent-by-id.ts";
import { useUpdateAgent } from "../agent/hook/update-agent.ts";

export const Route = createFileRoute("/admin/_staff/agents/$agentId")({
  params: {
    parse: ({ agentId }) => {
      if (!z.uuid().safeParse(agentId).success) throw notFound();
      return { agentId };
    },
  },
  loader: async ({ context, params }) => {
    const agent = await context.queryClient.ensureQueryData(
      getAgentByIdQueryOptions(params.agentId),
    );
    if (!agent) throw notFound();
  },
  head: () => ({ meta: [{ title: "Agent | Keyhaven" }] }),
  component: AgentPage,
  notFoundComponent: () => (
    <p className="text-gray-300">Cet agent n'existe pas.</p>
  ),
});

function AgentPage() {
  const { agentId } = Route.useParams();
  const { staff } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const { data: agent } = useGetAgentById(agentId);
  const { mutateAsync: updateAgent } = useUpdateAgent(agentId);
  const { mutateAsync: deleteAgent } = useDeleteAgent(agentId);
  if (!agent) throw notFound();
  const isSelf = agent.id === staff.id;

  return (
    <div className="flex max-w-xl flex-1 flex-col gap-10">
      <h1 className="text-3xl font-light text-white">
        {agent.firstName} {agent.lastName}
      </h1>
      <AgentForm
        agent={agent}
        canChangeRole={!isSelf}
        onSubmit={async (input) => {
          await updateAgent(input);
          await navigate({ to: "/admin/agents" });
        }}
        onRemove={
          isSelf
            ? undefined
            : async () => {
                await deleteAgent();
                await navigate({ to: "/admin/agents" });
              }
        }
      />
    </div>
  );
}
