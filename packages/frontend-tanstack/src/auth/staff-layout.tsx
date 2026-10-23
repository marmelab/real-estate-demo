import type { Staff } from "@remix-v3-demo/domain/auth/model";

import { AGENT_ROLE_LABELS } from "@remix-v3-demo/domain/agent/agent-role-labels";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, LogOut } from "lucide-react";

import { Logo } from "../brand/logo.tsx";
import { useSignOut } from "./hook/sign-out.ts";

const NAV_LINK_CLASS =
  "hover:text-gold focus-visible:outline-gold flex min-h-11 items-center px-3 text-sm tracking-[0.15em] text-gray-200 uppercase focus-visible:outline-2 data-[status=active]:text-gold";

export function StaffLayout({
  staff,
}: {
  staff: Pick<Staff, "firstName" | "lastName" | "role">;
}) {
  const navigate = useNavigate();
  const { mutate: signOut, isPending } = useSignOut();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-obsidian-600 bg-obsidian-950 flex flex-col gap-8 border-b p-6 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <Link
          to="/admin/listings"
          className="focus-visible:outline-gold flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span className="border-gold bg-obsidian-800 text-gold flex size-10 items-center justify-center border">
            <Logo className="size-7" />
          </span>
          <span className="eyebrow">Keyhaven</span>
        </Link>
        <nav aria-label="Administration">
          <ul className="space-y-1">
            <li>
              <Link to="/admin/listings" className={NAV_LINK_CLASS}>
                Annonces
              </Link>
            </li>
            {staff.role === "manager" && (
              <li>
                <Link to="/admin/agents" className={NAV_LINK_CLASS}>
                  Agents
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/"
                target="_blank"
                rel="noopener"
                className={`${NAV_LINK_CLASS} gap-2`}
              >
                Voir le site
                <ArrowUpRight aria-hidden="true" className="size-4" />
                <span className="sr-only">(nouvel onglet)</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto flex items-center gap-3">
          <Link
            to="/admin/profile"
            className="hover:text-gold focus-visible:outline-gold group min-w-0 flex-1 text-sm text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="block truncate group-hover:underline">
              {staff.firstName} {staff.lastName}
            </span>
            <span className="eyebrow block">
              {AGENT_ROLE_LABELS[staff.role]}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Se déconnecter"
            title="Se déconnecter"
            disabled={isPending}
            onClick={() =>
              signOut(undefined, {
                onSuccess: () => navigate({ to: "/admin/login" }),
              })
            }
            className="button-ghost size-11 shrink-0 px-0"
          >
            <LogOut aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </aside>
      <main className="flex w-full min-w-0 flex-1 flex-col p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
