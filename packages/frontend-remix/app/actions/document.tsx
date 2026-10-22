import type { Handle, RemixNode } from "remix/component";

import { ImportMap } from "remix/component/server";

import { scriptEntry } from "#assets";

import { routes } from "../routes.ts";
import { Logo } from "../ui/logo.tsx";

export type DocumentProps = {
  children?: RemixNode;
  description: string;
  nonce: string;
  title: string;
};

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { href, importMap, preloads } = scriptEntry;
    let { children, description, nonce, title } = handle.props;

    return (
      <html lang="fr">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="stylesheet" href="/styles.css" />
          <ImportMap value={importMap} nonce={nonce} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
          <script type="module" src={href} nonce={nonce}></script>
        </head>
        <body class="bg-obsidian-900 selection:bg-gold selection:text-obsidian-950 text-gray-200">
          <header class="border-obsidian-600 bg-obsidian-900 border-b">
            <div class="mx-auto flex h-20 max-w-7xl items-center px-4">
              <a
                href={routes.home.href()}
                class="group focus-visible:outline-gold flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <span class="border-gold bg-obsidian-800 text-gold flex size-10 items-center justify-center border">
                  <Logo class="size-7" />
                </span>
                <span class="flex flex-col">
                  <span class="group-hover:text-gold text-xl font-light tracking-[0.3em] text-white uppercase transition-colors">
                    Keyhaven
                  </span>
                  <span class="text-gold text-[10px] tracking-[0.35em] uppercase">
                    Résidences de prestige
                  </span>
                </span>
              </a>
            </div>
          </header>
          <main class="w-full">{children}</main>
        </body>
      </html>
    );
  };
}
