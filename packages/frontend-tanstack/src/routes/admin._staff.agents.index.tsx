import { listAgentsQuerySchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { AGENT_PAGE_SIZE } from "@remix-v3-demo/domain/agent/list-agents";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useRef, useState } from "react";

import { AgentTable } from "../agent/agent-table.tsx";
import { useInviteAgent } from "../agent/hook/invite-agent.ts";
import {
  listAgentsQueryOptions,
  useListAgents,
} from "../agent/hook/list-agents.ts";
import { InviteAgentForm } from "../agent/invite-agent-form.tsx";
import { Modal } from "../components/modal.tsx";
import { Pagination } from "../components/pagination.tsx";

export const Route = createFileRoute("/admin/_staff/agents/")({
  validateSearch: listAgentsQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listAgentsQueryOptions(deps)),
  head: () => ({ meta: [{ title: "Agents | Keyhaven" }] }),
  component: AgentsPage,
});

function AgentsPage() {
  const search = Route.useSearch();
  const { data } = useListAgents(search);
  const { mutateAsync: inviteAgent } = useInviteAgent();
  const inviteDialogRef = useRef<HTMLDialogElement>(null);
  const [invitedEmail, setInvitedEmail] = useState<string>();

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-light text-white">Agents</h1>
        <button
          type="button"
          onClick={() => {
            setInvitedEmail(undefined);
            inviteDialogRef.current?.showModal();
          }}
          className="button-gold"
        >
          <UserPlus aria-hidden="true" className="size-4" />
          Inviter un agent
        </button>
      </div>
      <p aria-live="polite" className="text-gold text-sm empty:hidden">
        {invitedEmail && `Invitation envoyée à ${invitedEmail}.`}
      </p>
      <div className="space-y-6">
        <AgentTable agents={data.agents} />
        <Pagination
          page={search.page}
          pageSize={AGENT_PAGE_SIZE}
          total={data.total}
        />
      </div>
      <Modal ref={inviteDialogRef} title="Inviter un agent">
        <InviteAgentForm
          onSubmit={inviteAgent}
          onInvited={(email) => {
            inviteDialogRef.current?.close();
            setInvitedEmail(email);
          }}
          onCancel={() => inviteDialogRef.current?.close()}
        />
      </Modal>
    </div>
  );
}
