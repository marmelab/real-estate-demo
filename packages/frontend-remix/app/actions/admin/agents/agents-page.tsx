import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { Handle } from "remix/component";

import { AGENT_PAGE_SIZE } from "@remix-v3-demo/domain/agent/list-agents";
import { UserPlus } from "lucide";

import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";
import type { InviteAgentValues } from "./invite-agent-form.tsx";

import { routes } from "../../../routes.ts";
import { Icon } from "../../../ui/icon.tsx";
import { Modal } from "../../../ui/modal.tsx";
import { Pagination } from "../../../ui/pagination.tsx";
import { AgentTable } from "./agent-table.tsx";
import { EMPTY_INVITE, InviteAgentForm } from "./invite-agent-form.tsx";

const INVITE_DIALOG_ID = "invite-agent";

export type InviteState = {
  values: InviteAgentValues;
  errors?: FieldErrors;
  error?: string;
};

export function AgentsPage(
  handle: Handle<{
    agents: Agent[];
    total: number;
    page: number;
    invitedEmail?: string;
    invite?: InviteState;
  }>,
) {
  return () => {
    let { agents, total, page, invitedEmail, invite } = handle.props;

    return (
      <div class="space-y-12">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h1 class="text-3xl font-light text-white">Agents</h1>
          <button
            type="button"
            commandfor={INVITE_DIALOG_ID}
            command="show-modal"
            class="button-gold"
          >
            <Icon icon={UserPlus} class="size-4" />
            Inviter un agent
          </button>
        </div>
        <p aria-live="polite" class="text-gold text-sm empty:hidden">
          {invitedEmail && `Invitation envoyée à ${invitedEmail}.`}
        </p>
        <div class="space-y-6">
          <AgentTable agents={agents} />
          <Pagination
            page={page}
            pageSize={AGENT_PAGE_SIZE}
            total={total}
            getPageHref={(nextPage) =>
              routes.admin.agents.index.href(undefined, {
                searchParams: { page: String(nextPage) },
              })
            }
          />
        </div>
        <Modal
          id={INVITE_DIALOG_ID}
          title="Inviter un agent"
          isOpen={invite !== undefined}
        >
          <InviteAgentForm
            dialogId={INVITE_DIALOG_ID}
            values={invite?.values ?? EMPTY_INVITE}
            errors={invite?.errors}
            error={invite?.error}
          />
        </Modal>
      </div>
    );
  };
}
