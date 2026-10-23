import { createFormHook } from "@tanstack/react-form";
import { z } from "zod";

import { CheckboxField } from "./checkbox-field.tsx";
import { fieldContext, formContext } from "./form-context.ts";
import { SelectField } from "./select-field.tsx";
import { SubmitButton } from "./submit-button.tsx";
import { TextAreaField } from "./text-area-field.tsx";
import { TextField } from "./text-field.tsx";

z.config(z.locales.fr());
z.config({
  customError: (issue) =>
    issue.input === undefined || issue.input === ""
      ? "Champ requis"
      : undefined,
});

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextAreaField, SelectField, CheckboxField },
  formComponents: { SubmitButton },
});
