import type { Agent } from "@remix-v3-demo/domain/agent/model";

import { agentInputSchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { deleteAgent } from "@remix-v3-demo/domain/agent/delete-agent";
import { getAgentById } from "@remix-v3-demo/domain/agent/get-agent-by-id";
import {
  agentRoleSchema,
  agentSchema,
} from "@remix-v3-demo/domain/agent/model";
import { updateAgent } from "@remix-v3-demo/domain/agent/update-agent";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { StaffContext } from "../../../../middleware/require-staff.ts";
import type { AgentFormValues } from "../../../../ui/agent-form.tsx";
import type { FieldErrors } from "../../../../ui/form/get-field-errors.ts";

import {
  requireManager,
  requireStaff,
} from "../../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../../middleware/supabase-session.ts";
import { routes } from "../../../../routes.ts";
import { AgentForm } from "../../../../ui/agent-form.tsx";
import { getFieldErrors } from "../../../../ui/form/get-field-errors.ts";
import { getSubmitErrorMessage } from "../../../../ui/get-submit-error-message.ts";
import { readAgentInput } from "../../../../ui/read-agent-input.ts";
import { renderStaffPage } from "../../render-admin-page.tsx";

type AgentEditContext = StaffContext & { params: { agentId: string } };

async function findAgent(context: AgentEditContext): Promise<Agent | null> {
  let { agentId } = context.params;
  return agentSchema.shape.id.safeParse(agentId).success
    ? getAgentById(context.supabase, agentId)
    : null;
}

function renderNotFound(context: AgentEditContext) {
  return renderStaffPage(context, {
    title: "Agent",
    status: 404,
    page: <p class="text-gray-300">Cet agent n'existe pas.</p>,
  });
}

function renderAgent(
  context: AgentEditContext,
  agent: Agent,
  form: { values?: AgentFormValues; errors?: FieldErrors; error?: string } = {},
  status = 200,
) {
  let isSelf = agent.id === context.staff.id;
  return renderStaffPage(context, {
    title: "Agent",
    status,
    page: (
      <div class="flex max-w-xl flex-1 flex-col gap-10">
        <h1 class="text-3xl font-light text-white">
          {agent.firstName} {agent.lastName}
        </h1>
        <AgentForm
          action={routes.admin.agents.edit.action.href({ agentId: agent.id })}
          values={form.values ?? agent}
          canChangeRole={!isSelf}
          canRemove={!isSelf}
          errors={form.errors}
          error={form.error}
        />
      </div>
    ),
  });
}

export default createController(routes.admin.agents.edit, {
  middleware: [supabaseSession(), requireStaff(), requireManager()],
  actions: {
    async index(context) {
      let agent = await findAgent(context);
      return agent ? renderAgent(context, agent) : renderNotFound(context);
    },
    async action(context) {
      let agent = await findAgent(context);
      if (!agent) return renderNotFound(context);
      let input = readAgentInput(
        context.formData,
        agent.id !== context.staff.id,
      );
      let values = {
        ...input,
        role: agentRoleSchema.safeParse(input.role).data ?? agent.role,
      };
      let parsed = s.parseSafe(agentInputSchema, input);
      if (!parsed.success) {
        return renderAgent(
          context,
          agent,
          { values, errors: getFieldErrors(parsed.issues) },
          400,
        );
      }
      try {
        await updateAgent(context.supabase, agent.id, parsed.value);
      } catch (error) {
        return renderAgent(
          context,
          agent,
          {
            values,
            error: getSubmitErrorMessage(error, "Enregistrement impossible"),
          },
          400,
        );
      }
      return redirect(routes.admin.agents.index.href(), 303);
    },
    async destroy(context) {
      let agent = await findAgent(context);
      if (!agent) return renderNotFound(context);
      try {
        if (agent.id === context.staff.id)
          throw new Error("Cannot remove self");
        await deleteAgent(context.supabase, agent.id);
      } catch (error) {
        return renderAgent(
          context,
          agent,
          { error: getSubmitErrorMessage(error, "Enregistrement impossible") },
          400,
        );
      }
      return redirect(routes.admin.agents.index.href(), 303);
    },
  },
});
