import type { QueryClient } from "@tanstack/react-query";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Logo } from "../brand/logo.tsx";
import "../styles.css";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Keyhaven",
      },
    ],
    links: [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootLayout() {
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

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-light text-white">Page introuvable</h1>
      <p className="text-gray-300">
        Cette page n'existe pas ou n'est plus disponible.
      </p>
      <Link to="/" className="button-gold">
        Retour à l'accueil
      </Link>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-obsidian-900 selection:bg-gold selection:text-obsidian-950 text-gray-200">
        {children}
        <TanStackDevtools
          plugins={[
            { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
