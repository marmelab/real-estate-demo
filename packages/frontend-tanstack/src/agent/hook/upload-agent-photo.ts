import type { UseMutationResult } from "@tanstack/react-query";

import { uploadAgentPhoto } from "@remix-v3-demo/domain/agent/upload-agent-photo";
import { getCurrentStaff } from "@remix-v3-demo/domain/auth/get-current-staff";
import { listingImageFileSchema } from "@remix-v3-demo/domain/listing-image/listing-image-validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";

const uploadAgentPhotoFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected FormData");
    return listingImageFileSchema.parse(data.get("file"));
  })
  .handler(async ({ data }) => {
    const client = createSessionClient();
    const staff = await getCurrentStaff(client);
    if (!staff) throw new Error("Not signed in");
    await uploadAgentPhoto(client, staff.id, data);
  });

export function useUploadAgentPhoto(): UseMutationResult<void, Error, File> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      return uploadAgentPhotoFn({ data: formData });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
}
