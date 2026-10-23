import type { Agent } from "@remix-v3-demo/domain/agent/model";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { AgentTable } from "./agent-table.tsx";

const agent: Agent = {
  id: "5b0e7a4c-2f61-4d8e-9a3b-1c2d3e4f5a6b",
  firstName: "Claire",
  lastName: "Martin",
  role: "manager",
  photoUrl: null,
  createdAt: "2026-03-05T12:00:00+00:00",
};

async function renderTable(agents: Agent[]) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => <AgentTable agents={agents} />,
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

describe("AgentTable", () => {
  it("should show the empty state when there is no agent", async () => {
    await renderTable([]);

    await expect.element(page.getByText("Aucun agent")).toBeVisible();
  });

  it("should list an agent with a link to its page, its role and its arrival date", async () => {
    await renderTable([agent]);

    await expect
      .element(page.getByRole("link", { name: "Claire Martin" }))
      .toHaveAttribute("href", `/admin/agents/${agent.id}`);
    await expect
      .element(page.getByRole("cell", { name: "Manager" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("cell", { name: "05/03/2026" }))
      .toBeVisible();
  });
});
