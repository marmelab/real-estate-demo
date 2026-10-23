import { configureZodErrors } from "@remix-v3-demo/domain/form/configure-zod-errors";
import { createFormHook } from "@tanstack/react-form";

import { CheckboxField } from "./checkbox-field.tsx";
import { fieldContext, formContext } from "./form-context.ts";
import { SelectField } from "./select-field.tsx";
import { SubmitButton } from "./submit-button.tsx";
import { TextAreaField } from "./text-area-field.tsx";
import { TextField } from "./text-field.tsx";

configureZodErrors();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextAreaField, SelectField, CheckboxField },
  formComponents: { SubmitButton },
});
