import { createFileRoute, useRouter } from "@tanstack/react-router";

import { useUpdateAgent } from "../agent/hook/update-agent.ts";
import { useUploadAgentPhoto } from "../agent/hook/upload-agent-photo.ts";
import { ProfileForm } from "../agent/profile-form.tsx";

export const Route = createFileRoute("/admin/_staff/profile")({
  head: () => ({ meta: [{ title: "Mon profil | Keyhaven" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { staff } = Route.useRouteContext();
  const router = useRouter();
  const { mutateAsync: updateAgent } = useUpdateAgent(staff.id);
  const { mutateAsync: uploadPhoto } = useUploadAgentPhoto();

  return (
    <div className="flex max-w-xl flex-1 flex-col gap-10">
      <h1 className="text-3xl font-light text-white">Mon profil</h1>
      <ProfileForm
        key={`${staff.firstName} ${staff.lastName}`}
        staff={staff}
        onSubmit={async (input) => {
          await updateAgent(input);
          await router.invalidate();
        }}
        onPhotoUpload={async (file) => {
          await uploadPhoto(file);
          await router.invalidate();
        }}
      />
    </div>
  );
}
