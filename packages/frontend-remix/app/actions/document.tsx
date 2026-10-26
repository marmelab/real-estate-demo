import type { Handle, RemixNode } from "remix/component";

import { ImportMap } from "remix/component/server";

import { scriptEntry, stylesHref } from "#assets";

const SUPABASE_URL = process.env.SUPABASE_URL;

export type DocumentProps = {
  children?: RemixNode;
  description?: string;
  isNoindex?: boolean;
  nonce: string;
  title: string;
};

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { href, importMap, preloads } = scriptEntry;
    let { children, description, isNoindex, nonce, title } = handle.props;

    return (
      <html lang="fr">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
          {isNoindex && <meta name="robots" content="noindex" />}
          {SUPABASE_URL && (
            <link rel="preconnect" href={new URL(SUPABASE_URL).origin} />
          )}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="stylesheet" href={stylesHref} />
          <ImportMap value={importMap} nonce={nonce} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
          <script type="module" src={href} nonce={nonce}></script>
        </head>
        <body class="bg-obsidian-900 selection:bg-gold selection:text-obsidian-950 text-gray-200">
          {children}
        </body>
      </html>
    );
  };
}
