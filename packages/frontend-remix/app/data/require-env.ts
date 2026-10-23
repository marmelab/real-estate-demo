export function requireEnv(name: string): string {
  let value = process.env[name];
  if (!value) throw new Error(`${name} must be set to reach Supabase.`);
  return value;
}
