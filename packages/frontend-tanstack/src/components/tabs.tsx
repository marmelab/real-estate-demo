import type { KeyboardEvent, ReactNode } from "react";

import { CircleAlert } from "lucide-react";

export type Tab<T extends string> = {
  id: T;
  label: string;
  hasError?: boolean;
};

function getTabId(idPrefix: string, id: string): string {
  return `${idPrefix}-tab-${id}`;
}

function getPanelId(idPrefix: string, id: string): string {
  return `${idPrefix}-panel-${id}`;
}

const KEY_OFFSETS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

export function TabList<T extends string>({
  idPrefix,
  label,
  tabs,
  selected,
  onSelect,
}: {
  idPrefix: string;
  label: string;
  tabs: readonly Tab<T>[];
  selected: T;
  onSelect: (id: T) => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === selected);
    const offset = KEY_OFFSETS[event.key];
    const next =
      event.key === "Home"
        ? tabs.at(0)
        : event.key === "End"
          ? tabs.at(-1)
          : offset === undefined
            ? undefined
            : tabs.at((index + offset) % tabs.length);
    if (!next) return;
    event.preventDefault();
    onSelect(next.id);
    document.getElementById(getTabId(idPrefix, next.id))?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="border-obsidian-600 flex flex-wrap border-b"
    >
      {tabs.map((tab) => {
        const isSelected = tab.id === selected;
        return (
          <button
            key={tab.id}
            id={getTabId(idPrefix, tab.id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={getPanelId(idPrefix, tab.id)}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            className={`focus-visible:outline-gold -mb-px flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 ${isSelected ? "border-gold text-gold" : "border-transparent text-gray-300 hover:text-white"}`}
          >
            {tab.label}
            {tab.hasError && (
              <span className="text-red-300">
                <CircleAlert aria-hidden="true" className="size-4" />
                <span className="sr-only">(erreurs)</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  id,
  isSelected,
  children,
}: {
  idPrefix: string;
  id: string;
  isSelected: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={getPanelId(idPrefix, id)}
      role="tabpanel"
      aria-labelledby={getTabId(idPrefix, id)}
      hidden={!isSelected}
      className="pt-8"
    >
      {children}
    </div>
  );
}
