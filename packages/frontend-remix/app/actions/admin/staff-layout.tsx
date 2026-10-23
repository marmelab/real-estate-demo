import type { Staff } from "@remix-v3-demo/domain/auth/model";
import type { Handle, RemixNode } from "remix/component";

import { AGENT_ROLE_LABELS } from "@remix-v3-demo/domain/agent/agent-role-labels";
import { ArrowUpRight, LogOut } from "lucide";

import { routes } from "../../routes.ts";
import { Icon } from "../../ui/icon.tsx";
import { Logo } from "../../ui/logo.tsx";

const NAV_LINK_CLASS =
  "hover:text-gold focus-visible:outline-gold flex min-h-11 items-center px-3 text-sm tracking-[0.15em] text-gray-200 uppercase focus-visible:outline-2 aria-[current=page]:text-gold";

export function StaffLayout(
  handle: Handle<{
    staff: Pick<Staff, "firstName" | "lastName" | "role">;
    pathname: string;
    children: RemixNode;
  }>,
) {
  return () => {
    let { staff, pathname, children } = handle.props;
    let navLink = (href: string, label: string) => (
      <a
        href={href}
        aria-current={pathname.startsWith(href) ? "page" : undefined}
        class={NAV_LINK_CLASS}
      >
        {label}
      </a>
    );

    return (
      <div class="flex min-h-screen flex-col md:flex-row">
        <aside class="border-obsidian-600 bg-obsidian-950 flex flex-col gap-8 border-b p-6 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
          <a
            href={routes.admin.listings.index.href()}
            class="focus-visible:outline-gold flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span class="border-gold bg-obsidian-800 text-gold flex size-10 items-center justify-center border">
              <Logo class="size-7" />
            </span>
            <span class="eyebrow">Keyhaven</span>
          </a>
          <nav aria-label="Administration">
            <ul class="space-y-1">
              <li>{navLink(routes.admin.listings.index.href(), "Annonces")}</li>
              {staff.role === "manager" && (
                <li>{navLink(routes.admin.agents.index.href(), "Agents")}</li>
              )}
              <li>
                <a
                  href={routes.home.href()}
                  target="_blank"
                  rel="noopener"
                  class={`${NAV_LINK_CLASS} gap-2`}
                >
                  Voir le site
                  <Icon icon={ArrowUpRight} class="size-4" />
                  <span class="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            </ul>
          </nav>
          <div class="mt-auto flex items-center gap-3">
            <a
              href={routes.admin.profile.index.href()}
              class="hover:text-gold focus-visible:outline-gold group min-w-0 flex-1 text-sm text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span class="block truncate group-hover:underline">
                {staff.firstName} {staff.lastName}
              </span>
              <span class="eyebrow block">{AGENT_ROLE_LABELS[staff.role]}</span>
            </a>
            <form
              method="post"
              action={routes.admin.logout.href()}
              class="shrink-0"
            >
              <button
                type="submit"
                aria-label="Se déconnecter"
                title="Se déconnecter"
                class="button-ghost size-11 shrink-0 px-0"
              >
                <Icon icon={LogOut} class="size-5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </aside>
        <main class="flex w-full min-w-0 flex-1 flex-col p-6 md:p-10">
          {children}
        </main>
      </div>
    );
  };
}
