import type { ReactNode, RefObject } from "react";

import { useId } from "react";

export function Modal({
  ref,
  title,
  onClose,
  children,
}: {
  ref: RefObject<HTMLDialogElement | null>;
  title: string;
  onClose?: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="border-obsidian-600 bg-obsidian-800 m-auto w-[calc(100%-2rem)] max-w-md border p-0 text-gray-200 backdrop:bg-black/70"
    >
      <div className="space-y-6 p-8">
        <h2 id={titleId} className="text-xl font-light text-white">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
