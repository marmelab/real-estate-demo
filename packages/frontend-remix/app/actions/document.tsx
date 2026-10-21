import type { Handle, RemixNode } from "remix/component";

import { ImportMap } from "remix/component/server";

import { scriptEntry } from "#assets";

export type DocumentProps = {
  children?: RemixNode;
  nonce: string;
};

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { href, importMap, preloads } = scriptEntry;
    let { children, nonce } = handle.props;

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Real estate agency</title>
          <link rel="stylesheet" href="/styles.css" />
          <ImportMap value={importMap} nonce={nonce} />
          {preloads.map((preloadHref) => (
            <link key={preloadHref} rel="modulepreload" href={preloadHref} />
          ))}
          <script type="module" src={href} nonce={nonce}></script>
        </head>
        <body>
          <main class="w-full">{children}</main>
        </body>
      </html>
    );
  };
}
