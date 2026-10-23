import type { ReactNode } from "react";

import { Logo } from "../brand/logo.tsx";

export function AuthPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <div className="border-obsidian-600 bg-obsidian-800 w-full max-w-md space-y-8 border p-8">
        <div className="flex items-center gap-3">
          <span className="border-gold bg-obsidian-900 text-gold flex size-10 items-center justify-center border">
            <Logo className="size-7" />
          </span>
          <span className="eyebrow">Keyhaven · Espace agents</span>
        </div>
        <h1 className="text-2xl font-light text-white">{title}</h1>
        {children}
      </div>
    </main>
  );
}
