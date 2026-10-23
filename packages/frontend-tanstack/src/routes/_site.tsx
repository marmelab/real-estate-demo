import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { Logo } from "../brand/logo.tsx";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <>
      <header className="border-obsidian-600 bg-obsidian-900 border-b">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-4">
          <Link
            to="/"
            className="group focus-visible:outline-gold flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="border-gold bg-obsidian-800 text-gold flex size-10 items-center justify-center border">
              <Logo className="size-7" />
            </span>
            <span className="flex flex-col">
              <span className="group-hover:text-gold text-xl font-light tracking-[0.3em] text-white uppercase transition-colors">
                Keyhaven
              </span>
              <span className="text-gold text-[10px] tracking-[0.35em] uppercase">
                Résidences de prestige
              </span>
            </span>
          </Link>
        </div>
      </header>
      <main className="w-full">
        <Outlet />
      </main>
    </>
  );
}
