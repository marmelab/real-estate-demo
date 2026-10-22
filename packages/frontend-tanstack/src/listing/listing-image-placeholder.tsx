import { Logo } from "../brand/logo.tsx";

export function ListingImagePlaceholder({ className }: { className: string }) {
  return (
    <div
      className={`bg-obsidian-950 text-gold flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <Logo className="size-14" />
      <p className="eyebrow text-gray-400">Photos sur demande</p>
    </div>
  );
}
