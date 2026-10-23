import type { Staff } from "@remix-v3-demo/domain/auth/model";
import type { Handle } from "remix/component";

import type { AgentFormValues } from "../../../ui/agent-form.tsx";
import type { FieldErrors } from "../../../ui/form/get-field-errors.ts";

import { routes } from "../../../routes.ts";
import { AgentForm } from "../../../ui/agent-form.tsx";
import { ImageFileInput } from "../../../ui/public/image-file-input.tsx";

export type ProfilePageProps = {
  staff: Staff;
  values?: AgentFormValues;
  errors?: FieldErrors;
  error?: string;
  photoError?: string;
};

export function ProfilePage(handle: Handle<ProfilePageProps>) {
  return () => {
    let { staff, values, errors, error, photoError } = handle.props;

    return (
      <div class="flex max-w-xl flex-1 flex-col gap-10">
        <h1 class="text-3xl font-light text-white">Mon profil</h1>
        <div class="flex flex-1 flex-col gap-10">
          <section aria-labelledby="profile-photo" class="space-y-4">
            <h2 id="profile-photo" class="eyebrow">
              Photo
            </h2>
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={`${staff.firstName} ${staff.lastName}`}
                class="border-obsidian-600 size-32 border object-cover"
              />
            ) : (
              <p class="text-gray-300">Aucune photo pour l'instant.</p>
            )}
            <form
              method="post"
              action={routes.admin.profile.photo.href()}
              enctype="multipart/form-data"
            >
              <ImageFileInput
                label="Changer de photo"
                name="file"
                error={photoError}
              />
            </form>
          </section>
          <section
            aria-labelledby="profile-names"
            class="flex flex-1 flex-col gap-4"
          >
            <h2 id="profile-names" class="eyebrow">
              Identité
            </h2>
            <AgentForm
              action={routes.admin.profile.action.href()}
              values={values ?? staff}
              canChangeRole={false}
              errors={errors}
              error={error}
            />
          </section>
        </div>
      </div>
    );
  };
}
