import { useState } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import type { Tab } from "./tabs.tsx";

import { TabList, TabPanel } from "./tabs.tsx";

type TabId = "general" | "photos" | "agent";

const tabs: Tab<TabId>[] = [
  { id: "general", label: "Général" },
  { id: "photos", label: "Photos", hasError: true },
  { id: "agent", label: "Agent" },
];

function Tabs({
  initial,
  onSelect,
}: {
  initial: TabId;
  onSelect: (id: TabId) => void;
}) {
  const [selected, setSelected] = useState(initial);
  return (
    <>
      <TabList
        idPrefix="listing"
        label="Sections"
        tabs={tabs}
        selected={selected}
        onSelect={(id) => {
          onSelect(id);
          setSelected(id);
        }}
      />
      {tabs.map((tab) => (
        <TabPanel
          key={tab.id}
          idPrefix="listing"
          id={tab.id}
          isSelected={tab.id === selected}
        >
          Contenu {tab.label}
        </TabPanel>
      ))}
    </>
  );
}

async function renderTabs(initial: TabId) {
  const onSelect = vi.fn();
  await render(<Tabs initial={initial} onSelect={onSelect} />);
  return onSelect;
}

describe("Tabs", () => {
  it("should select the clicked tab", async () => {
    const onSelect = await renderTabs("general");

    await page.getByRole("tab", { name: "Agent" }).click();

    expect(onSelect).toHaveBeenCalledWith("agent");
    await expect
      .element(page.getByRole("tab", { name: "Agent" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it.each([
    ["ArrowRight", "agent", "Général", "general"],
    ["ArrowLeft", "general", "Agent", "agent"],
    ["Home", "agent", "Général", "general"],
    ["End", "general", "Agent", "agent"],
  ] as const)(
    "should move the selection and focus with %s from %s",
    async (key, initial, label, expected) => {
      const onSelect = await renderTabs(initial);
      page.getByRole("tab", { selected: true }).element().focus();

      await userEvent.keyboard(`{${key}}`);

      expect(onSelect).toHaveBeenCalledWith(expected);
      await expect
        .element(page.getByRole("tab", { name: label }))
        .toHaveFocus();
    },
  );

  it("should flag a tab holding errors", async () => {
    await renderTabs("general");

    await expect
      .element(page.getByRole("tab", { name: /^Photos.*\(erreurs\)$/ }))
      .toBeVisible();
  });

  it("should show only the selected tab panel", async () => {
    await renderTabs("photos");

    await expect
      .element(page.getByRole("tabpanel", { name: /^Photos/ }))
      .toHaveTextContent("Contenu Photos");
    await expect.element(page.getByText("Contenu Général")).not.toBeVisible();
  });
});
