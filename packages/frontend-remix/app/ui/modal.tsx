import type { Handle, RemixNode } from "remix/component";

import { ShowModal } from "./public/show-modal.tsx";

export function Modal(
  handle: Handle<{
    id: string;
    title: string;
    isOpen?: boolean;
    children: RemixNode;
  }>,
) {
  return () => {
    let { id, title, isOpen, children } = handle.props;

    return (
      <dialog
        id={id}
        data-rmx-key={crypto.randomUUID()}
        closedby="any"
        aria-labelledby={`${id}-title`}
        class="border-obsidian-600 bg-obsidian-800 m-auto w-[calc(100%-2rem)] max-w-md border p-0 text-gray-200 backdrop:bg-black/70"
      >
        <div class="space-y-6 p-8">
          <h2 id={`${id}-title`} class="text-xl font-light text-white">
            {title}
          </h2>
          {children}
        </div>
        {isOpen && <ShowModal dialogId={id} />}
      </dialog>
    );
  };
}
