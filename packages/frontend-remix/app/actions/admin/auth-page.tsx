import type { Handle, RemixNode } from "remix/component";

import { Logo } from "../../ui/logo.tsx";

export function AuthPage(
  handle: Handle<{ title: string; children: RemixNode }>,
) {
  return () => (
    <main class="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div class="border-obsidian-600 bg-obsidian-800 w-full max-w-md space-y-8 border p-8">
        <div class="flex items-center gap-3">
          <span class="border-gold bg-obsidian-900 text-gold flex size-10 items-center justify-center border">
            <Logo class="size-7" />
          </span>
          <span class="eyebrow">Keyhaven · Espace agents</span>
        </div>
        <h1 class="text-2xl font-light text-white">{handle.props.title}</h1>
        {handle.props.children}
      </div>
    </main>
  );
}
