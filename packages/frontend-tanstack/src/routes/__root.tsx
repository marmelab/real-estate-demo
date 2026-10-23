import type { QueryClient } from "@tanstack/react-query";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

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
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-20 text-center">
        <h1 className="text-3xl font-light text-white">Page introuvable</h1>
        <p className="text-gray-300">
          Cette page n'existe pas ou n'est plus disponible.
        </p>
        <Link to="/" className="button-gold">
          Retour à l'accueil
        </Link>
      </div>
    </main>
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
