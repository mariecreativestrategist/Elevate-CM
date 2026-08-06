import "server-only";
import { createClient } from "@supabase/supabase-js";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "cadence-uploads";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase Storage n'est pas configuré : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis."
    );
  }
  return createClient(url, serviceKey);
}

/**
 * Stockage fichier via Supabase Storage (bucket public). Remplace le stockage
 * local (incompatible avec le filesystem éphémère de Vercel).
 */
export async function saveUploadedFile(file: File, clientId: string, subfolder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${clientId}/${subfolder}/${Date.now()}-${safeName}`;

  const supabase = supabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) {
    throw new Error(`Échec de l'upload vers Supabase Storage : ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
