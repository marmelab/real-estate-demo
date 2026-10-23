import type { SupabaseClient } from "@supabase/supabase-js";

import type { InviteAgent } from "./agent-validator.ts";

// The caller must first check that the inviter is a manager, see ADR 0002.
export async function inviteAgent(
  serviceClient: SupabaseClient,
  { email, firstName, lastName, role }: InviteAgent,
  redirectTo: string,
): Promise<void> {
  const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(
    email,
    { redirectTo },
  );
  if (error) throw error;

  const { error: insertError } = await serviceClient.from("agent").insert({
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    role,
  });
  if (insertError) {
    await serviceClient.auth.admin.deleteUser(data.user.id);
    throw insertError;
  }
}
