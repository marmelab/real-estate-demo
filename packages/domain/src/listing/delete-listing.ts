import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteListing(
  client: SupabaseClient,
  id: number,
): Promise<void> {
  const { error } = await client
    .from("listing")
    .delete()
    .eq("id", id)
    .select("id")
    .single();
  if (error) throw error;

  const bucket = client.storage.from("listing-image");
  const { data: files, error: listError } = await bucket.list(String(id));
  if (listError) throw listError;
  if (files.length === 0) return;

  const { error: removeError } = await bucket.remove(
    files.map((file) => `${id}/${file.name}`),
  );
  if (removeError) throw removeError;
}
