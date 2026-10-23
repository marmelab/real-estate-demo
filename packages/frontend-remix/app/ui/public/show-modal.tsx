import type { Handle } from "remix/component";

import { clientEntry } from "remix/component";

export const ShowModal = clientEntry(
  import.meta.url,
  function ShowModal(handle: Handle<{ dialogId: string }>) {
    handle.queueTask(() => {
      let dialog = document.getElementById(handle.props.dialogId);
      if (dialog instanceof HTMLDialogElement && !dialog.open) {
        dialog.showModal();
      }
    });
    return () => null;
  },
);
