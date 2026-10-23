import type { Handle } from "remix/component";

import { clientEntry, on } from "remix/component";

export const AltTextInput = clientEntry(
  import.meta.url,
  function AltTextInput(handle: Handle<{ name: string; value: string }>) {
    return () => (
      <input
        name={handle.props.name}
        defaultValue={handle.props.value}
        maxLength={300}
        mix={[
          on("blur", (event) => {
            if (event.currentTarget.value === handle.props.value) return;
            event.currentTarget.form?.requestSubmit();
          }),
          on("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }),
        ]}
        class="field-input"
      />
    );
  },
);
