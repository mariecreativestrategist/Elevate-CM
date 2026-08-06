import "server-only";
import { requireClient } from "@/lib/auth";

/**
 * Équivalent applicatif des policies RLS Supabase : toute lecture/écriture côté
 * portail client doit passer par ce clientId (jamais un id fourni par le client
 * dans les params). À réappliquer en policies SQL `USING (client_id = auth.uid())`
 * lors de la bascule vers Supabase.
 */
export async function currentClientId(): Promise<string> {
  const session = await requireClient();
  return session.sub;
}
