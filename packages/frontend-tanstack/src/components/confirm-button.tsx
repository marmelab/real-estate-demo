import type { ReactNode } from "react";

import { useRef } from "react";

import { Modal } from "./modal.tsx";

export function ConfirmButton({
  label,
  icon,
  title,
  message,
  confirmLabel,
  className,
  onConfirm,
}: {
  label: string;
  icon?: ReactNode;
  title: string;
  message: string;
  confirmLabel: string;
  className: string;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label={icon ? label : undefined}
        title={icon ? label : undefined}
        onClick={() => dialogRef.current?.showModal()}
        className={className}
      >
        {icon ?? label}
      </button>
      <Modal ref={dialogRef} title={title}>
        <p className="text-gray-300">{message}</p>
        <div className="flex flex-wrap justify-end gap-4">
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="button-outline"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
              onConfirm();
            }}
            className="button-gold"
          >
            {confirmLabel}
          </button>
        </div>
      </Modal>
    </>
  );
}
