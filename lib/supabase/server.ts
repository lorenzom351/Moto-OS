import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

function requiredEnvironmentVariable(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`A variável de ambiente ${name} não foi configurada.`);
  return value;
}

/** Cliente exclusivo do servidor. A service role nunca deve usar NEXT_PUBLIC_. */
export function getSupabaseAdmin() {
  if (!client) {
    client = createClient(
      requiredEnvironmentVariable("SUPABASE_URL"),
      requiredEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  return client;
}

export function assertSupabaseResult(error: { message: string } | null) {
  if (error) throw new Error(`Falha no Supabase: ${error.message}`);
}
