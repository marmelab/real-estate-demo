import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { AgentTable } from "./agent-table.tsx";

const agent = {
  id: "8f6c2a4e-3b1d-4c5e-9a7f-1d2e3f4a5b6c",
  firstName: "Claire",
  lastName: "Martin",
  role: "manager" as const,
  createdAt: "2026-03-05T10:00:00Z",
};

describe("AgentTable", () => {
  it("shows the empty state without agents", (t) => {
    let { container, cleanup } = render(<AgentTable agents={[]} />);
    t.after(cleanup);

    assert.equal(container.textContent, "Aucun agent");
  });

  it("links each agent to its edit page with its role and fr-FR arrival date", (t) => {
    let { $, $$, cleanup } = render(<AgentTable agents={[agent]} />);
    t.after(cleanup);

    assert.deepEqual(
      {
        href: $("tbody a")?.getAttribute("href"),
        cells: [...$$("tbody th, tbody td")].map((cell) => cell.textContent),
      },
      {
        href: `/admin/agents/${agent.id}`,
        cells: ["Claire Martin", "Manager", "05/03/2026"],
      },
    );
  });
});
