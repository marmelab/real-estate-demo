import type { IconNode } from "lucide";
import type { Handle } from "remix/component";

import { Icon } from "./icon.tsx";
import { Modal } from "./modal.tsx";

export type ConfirmSubmitter = { name: string; value: string };

export function ConfirmButton(
  handle: Handle<{
    label: string;
    icon?: IconNode;
    title: string;
    message: string;
    confirmLabel: string;
    class: string;
    submitter: ConfirmSubmitter;
  }>,
) {
  return () => {
    let dialogId = `${handle.id}-dialog`;
    let { label, icon, title, message, confirmLabel, submitter } = handle.props;

    return (
      <>
        <button
          type="button"
          commandfor={dialogId}
          command="show-modal"
          aria-label={icon ? label : undefined}
          title={icon ? label : undefined}
          class={handle.props.class}
        >
          {icon ? <Icon icon={icon} class="size-5" strokeWidth={1.5} /> : label}
        </button>
        <Modal id={dialogId} title={title}>
          <p class="text-gray-300">{message}</p>
          <div class="flex flex-wrap justify-end gap-4">
            <button
              type="button"
              commandfor={dialogId}
              command="close"
              autofocus
              class="button-outline"
            >
              Annuler
            </button>
            <button
              type="submit"
              name={submitter.name}
              value={submitter.value}
              class="button-gold"
            >
              {confirmLabel}
            </button>
          </div>
        </Modal>
      </>
    );
  };
}
