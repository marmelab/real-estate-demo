import { useRef } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { Modal } from "./modal.tsx";

function OpenedModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()}>
        Ouvrir
      </button>
      <Modal ref={ref} title="Retirer cet agent ?" onClose={onClose}>
        <button type="button">Retirer</button>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it.each([
    ["Escape", () => userEvent.keyboard("{Escape}")],
    [
      "a backdrop click",
      () => page.getByRole("dialog").click({ position: { x: -10, y: -10 } }),
    ],
  ])("should close and notify on %s", async (_, close) => {
    const onClose = vi.fn();
    await render(<OpenedModal onClose={onClose} />);
    await page.getByRole("button", { name: "Ouvrir" }).click();
    await expect
      .element(page.getByRole("dialog", { name: "Retirer cet agent ?" }))
      .toBeVisible();

    await close();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
