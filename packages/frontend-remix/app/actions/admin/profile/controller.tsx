import { agentInputSchema } from "@remix-v3-demo/domain/agent/agent-validator";
import { updateAgent } from "@remix-v3-demo/domain/agent/update-agent";
import { uploadAgentPhoto } from "@remix-v3-demo/domain/agent/upload-agent-photo";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { StaffContext } from "../../../middleware/require-staff.ts";
import type { ProfilePageProps } from "./profile-page.tsx";

import { requireStaff } from "../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../middleware/supabase-session.ts";
import { routes } from "../../../routes.ts";
import { getFieldErrors } from "../../../ui/form/get-field-errors.ts";
import { readImageFile } from "../../../ui/form/read-image-file.ts";
import { getSubmitErrorMessage } from "../../../ui/get-submit-error-message.ts";
import { readAgentInput } from "../../../ui/read-agent-input.ts";
import { renderStaffPage } from "../render-admin-page.tsx";
import { ProfilePage } from "./profile-page.tsx";

function renderProfile(
  context: StaffContext,
  props: Omit<ProfilePageProps, "staff"> = {},
  status = 200,
) {
  return renderStaffPage(context, {
    title: "Mon profil",
    status,
    page: <ProfilePage staff={context.staff} {...props} />,
  });
}

export default createController(routes.admin.profile, {
  middleware: [supabaseSession(), requireStaff()],
  actions: {
    index(context) {
      return renderProfile(context);
    },
    photoPage() {
      return redirect(routes.admin.profile.index.href());
    },
    async action(context) {
      let values = {
        ...readAgentInput(context.formData, false),
        role: context.staff.role,
      };
      let parsed = s.parseSafe(agentInputSchema, {
        ...values,
        role: undefined,
      });
      if (!parsed.success) {
        return renderProfile(
          context,
          { values, errors: getFieldErrors(parsed.issues) },
          400,
        );
      }
      try {
        await updateAgent(context.supabase, context.staff.id, parsed.value);
      } catch (error) {
        return renderProfile(
          context,
          {
            values,
            error: getSubmitErrorMessage(error, "Enregistrement impossible"),
          },
          400,
        );
      }
      return redirect(routes.admin.profile.index.href(), 303);
    },
    async photo(context) {
      let { file, error } = readImageFile(context.formData, "file");
      if (!file) return renderProfile(context, { photoError: error }, 400);
      try {
        await uploadAgentPhoto(context.supabase, context.staff.id, file);
      } catch (uploadError) {
        console.error(uploadError);
        return renderProfile(
          context,
          { photoError: "L'envoi de la photo a échoué" },
          400,
        );
      }
      return redirect(routes.admin.profile.index.href(), 303);
    },
  },
});
