import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { AgentForm } from "./agent-form.tsx";

const values = {
  firstName: "Claire",
  lastName: "Martin",
  role: "agent" as const,
};

describe("AgentForm", () => {
  for (let canChangeRole of [true, false]) {
    it(`shows the role select only when the role can change, here ${canChangeRole}`, (t) => {
      let { $, cleanup } = render(
        <AgentForm
          action="/admin/agents/1"
          values={values}
          canChangeRole={canChangeRole}
        />,
      );
      t.after(cleanup);

      assert.equal($('select[name="role"]') !== null, canChangeRole);
    });
  }

  for (let canRemove of [true, false]) {
    it(`shows the remove button only when the agent can be removed, here ${canRemove}`, (t) => {
      let { $, cleanup } = render(
        <AgentForm
          action="/admin/agents/1"
          values={values}
          canChangeRole
          canRemove={canRemove}
        />,
      );
      t.after(cleanup);

      assert.equal($('button[command="show-modal"]') !== null, canRemove);
    });
  }

  it("flags the fields with an error", (t) => {
    let { $$, cleanup } = render(
      <AgentForm
        action="/admin/agents/1"
        values={values}
        canChangeRole
        errors={{ lastName: "Champ requis" }}
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$('[aria-invalid="true"]')].map((field) =>
        field.getAttribute("name"),
      ),
      ["lastName"],
    );
  });
});
