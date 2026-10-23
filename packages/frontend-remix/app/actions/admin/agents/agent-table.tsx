import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { Handle } from "remix/component";

import { AGENT_ROLE_LABELS } from "@remix-v3-demo/domain/agent/agent-role-labels";

import { routes } from "../../../routes.ts";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Europe/Paris",
});

export function AgentTable(
  handle: Handle<{
    agents: Pick<
      Agent,
      "id" | "firstName" | "lastName" | "role" | "createdAt"
    >[];
  }>,
) {
  return () => {
    let { agents } = handle.props;
    if (agents.length === 0) {
      return <p class="py-12 text-center text-gray-300">Aucun agent</p>;
    }

    return (
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <caption class="sr-only">Agents</caption>
          <thead class="border-obsidian-600 border-b">
            <tr>
              <th scope="col" class="eyebrow px-3 py-3">
                Nom
              </th>
              <th scope="col" class="eyebrow px-3 py-3">
                Rôle
              </th>
              <th scope="col" class="eyebrow px-3 py-3">
                Arrivée
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} class="border-obsidian-700 border-b">
                <th scope="row" class="px-3 py-3 font-normal">
                  <a
                    href={routes.admin.agents.edit.index.href({
                      agentId: agent.id,
                    })}
                    class="hover:text-gold focus-visible:outline-gold text-white underline-offset-4 hover:underline focus-visible:outline-2"
                  >
                    {agent.firstName} {agent.lastName}
                  </a>
                </th>
                <td class="px-3 py-3">{AGENT_ROLE_LABELS[agent.role]}</td>
                <td class="px-3 py-3">
                  {dateFormat.format(new Date(agent.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
}
