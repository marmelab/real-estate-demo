import { getImageFileError } from "@remix-v3-demo/domain/listing-image/get-image-file-error";
import { useId, useState } from "react";

import { FormAlert } from "../components/form/form-alert.tsx";

export function ImageFileInput({
  label,
  onUpload,
}: {
  label: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const id = useId();
  const [error, setError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          if (!file) return;
          const fileError = getImageFileError(file);
          setError(fileError);
          if (fileError) return;
          setIsUploading(true);
          try {
            await onUpload(file);
            input.value = "";
          } catch {
            setError("L'envoi de la photo a échoué");
          } finally {
            setIsUploading(false);
          }
        }}
        className="file:border-obsidian-600 file:bg-obsidian-800 file:text-gold hover:file:border-gold focus-visible:outline-gold w-full text-sm text-gray-300 file:mr-4 file:min-h-11 file:border file:px-4 file:text-xs file:tracking-[0.15em] file:uppercase focus-visible:outline-2"
      />
      <FormAlert message={error} />
    </div>
  );
}
