import type { Agent } from "@remix-v3-demo/domain/agent/model";

import { Link } from "@tanstack/react-router";

import { AGENT_ROLE_LABELS } from "./agent-role-labels.ts";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Europe/Paris",
});

export function AgentTable({
  agents,
}: {
  agents: Pick<Agent, "id" | "firstName" | "lastName" | "role" | "createdAt">[];
}) {
  if (agents.length === 0) {
    return <p className="py-12 text-center text-gray-300">Aucun agent</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Agents</caption>
        <thead className="border-obsidian-600 border-b">
          <tr>
            <th scope="col" className="eyebrow px-3 py-3">
              Nom
            </th>
            <th scope="col" className="eyebrow px-3 py-3">
              Rôle
            </th>
            <th scope="col" className="eyebrow px-3 py-3">
              Arrivée
            </th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} className="border-obsidian-700 border-b">
              <th scope="row" className="px-3 py-3 font-normal">
                <Link
                  to="/admin/agents/$agentId"
                  params={{ agentId: agent.id }}
                  className="hover:text-gold focus-visible:outline-gold text-white underline-offset-4 hover:underline focus-visible:outline-2"
                >
                  {agent.firstName} {agent.lastName}
                </Link>
              </th>
              <td className="px-3 py-3">{AGENT_ROLE_LABELS[agent.role]}</td>
              <td className="px-3 py-3">
                {dateFormat.format(new Date(agent.createdAt))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
