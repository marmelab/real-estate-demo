import {
  inviteAgentSchema,
  listAgentsQuerySchema,
} from "@remix-v3-demo/domain/agent/agent-validator";
import { inviteAgent } from "@remix-v3-demo/domain/agent/invite-agent";
import { listAgents } from "@remix-v3-demo/domain/agent/list-agents";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { StaffContext } from "../../../middleware/require-staff.ts";
import type { InviteState } from "./agents-page.tsx";

import { createServiceClient } from "../../../data/service-client.ts";
import {
  requireManager,
  requireStaff,
} from "../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../middleware/supabase-session.ts";
import { routes } from "../../../routes.ts";
import { getFieldErrors } from "../../../ui/form/get-field-errors.ts";
import { readText } from "../../../ui/form/read-text.ts";
import { getSubmitErrorMessage } from "../../../ui/get-submit-error-message.ts";
import { renderStaffPage } from "../render-admin-page.tsx";
import { AgentsPage } from "./agents-page.tsx";

async function renderAgents(
  context: StaffContext,
  { invite, status }: { invite?: InviteState; status?: number } = {},
) {
  let query = listAgentsQuerySchema.parse(
    Object.fromEntries(context.url.searchParams),
  );
  let { agents, total } = await listAgents(context.supabase, query);
  return renderStaffPage(context, {
    title: "Agents",
    status,
    page: (
      <AgentsPage
        agents={agents}
        total={total}
        page={query.page}
        invitedEmail={
          invite
            ? undefined
            : (context.url.searchParams.get("invited") ?? undefined)
        }
        invite={invite}
      />
    ),
  });
}

export default createController(routes.admin.agents, {
  middleware: [supabaseSession(), requireStaff(), requireManager()],
  actions: {
    index(context) {
      return renderAgents(context);
    },
    async invite(context) {
      let values = {
        email: readText(context.formData, "email"),
        firstName: readText(context.formData, "firstName"),
        lastName: readText(context.formData, "lastName"),
        role: readText(context.formData, "role"),
      };
      let parsed = s.parseSafe(inviteAgentSchema, values);
      if (!parsed.success) {
        return renderAgents(context, {
          invite: { values, errors: getFieldErrors(parsed.issues) },
          status: 400,
        });
      }
      try {
        await inviteAgent(
          createServiceClient(),
          parsed.value,
          new URL(routes.admin.acceptInvite.index.href(), context.url).href,
        );
      } catch (error) {
        return renderAgents(context, {
          invite: {
            values,
            error: getSubmitErrorMessage(
              error,
              "L'invitation n'a pas pu être envoyée",
            ),
          },
          status: 400,
        });
      }
      return redirect(
        routes.admin.agents.index.href(undefined, {
          searchParams: { invited: parsed.value.email },
        }),
        303,
      );
    },
  },
});
