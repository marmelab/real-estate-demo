import { Link } from "@tanstack/react-router";

export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="border-obsidian-700 flex items-center gap-2 border-b pb-6 text-xs tracking-widest text-gray-400 uppercase"
    >
      <Link
        to="/"
        className="hover:text-gold focus-visible:outline-gold focus-visible:outline-2"
      >
        Accueil
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page" className="text-gold">
        {current}
      </span>
    </nav>
  );
}
