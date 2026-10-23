import type { AgentInput } from "@remix-v3-demo/domain/agent/agent-validator";
import type { Staff } from "@remix-v3-demo/domain/auth/model";

import { ImageFileInput } from "../listing-image/image-file-input.tsx";
import { AgentForm } from "./agent-form.tsx";

export function ProfileForm({
  staff,
  onSubmit,
  onPhotoUpload,
}: {
  staff: Pick<Staff, "firstName" | "lastName" | "role" | "photoUrl">;
  onSubmit: (input: AgentInput) => Promise<void>;
  onPhotoUpload: (file: File) => Promise<void>;
}) {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <section aria-labelledby="profile-photo" className="space-y-4">
        <h2 id="profile-photo" className="eyebrow">
          Photo
        </h2>
        {staff.photoUrl ? (
          <img
            src={staff.photoUrl}
            alt={`${staff.firstName} ${staff.lastName}`}
            className="border-obsidian-600 size-32 border object-cover"
          />
        ) : (
          <p className="text-gray-300">Aucune photo pour l'instant.</p>
        )}
        <ImageFileInput label="Changer de photo" onUpload={onPhotoUpload} />
      </section>
      <section
        aria-labelledby="profile-names"
        className="flex flex-1 flex-col gap-4"
      >
        <h2 id="profile-names" className="eyebrow">
          Identité
        </h2>
        <AgentForm agent={staff} canChangeRole={false} onSubmit={onSubmit} />
      </section>
    </div>
  );
}
