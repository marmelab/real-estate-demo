import type { AgentRole } from "@remix-v3-demo/domain/agent/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { StaffLayout } from "./staff-layout.tsx";

function renderLayout(role: AgentRole, pathname: string) {
  return render(
    <StaffLayout
      staff={{ firstName: "Claire", lastName: "Martin", role }}
      pathname={pathname}
    >
      <p>Contenu</p>
    </StaffLayout>,
  );
}

function navLinks($$: (selector: string) => NodeListOf<HTMLElement>) {
  return Object.fromEntries(
    [...$$("nav a:not([target])")].map((link) => [
      link.textContent,
      link.getAttribute("aria-current"),
    ]),
  );
}

describe("StaffLayout", () => {
  for (let [role, links] of [
    ["manager", { Annonces: null, Agents: "page" }],
    ["agent", { Annonces: null }],
  ] as const) {
    it(`shows the Agents link only to managers, here ${role}`, (t) => {
      let { $$, cleanup } = renderLayout(role, "/admin/agents/42");
      t.after(cleanup);

      assert.deepEqual(navLinks($$), links);
    });
  }

  it("marks the section of the current path as current", (t) => {
    let { $$, cleanup } = renderLayout("manager", "/admin/listings/3");
    t.after(cleanup);

    assert.deepEqual(navLinks($$), { Annonces: "page", Agents: null });
  });
});
