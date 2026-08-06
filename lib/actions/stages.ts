"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type StageName = "onboarding" | "strategie" | "calendrier" | "resultats";
type StageStatus = "a_faire" | "en_cours" | "complete";

export async function setStageStatusAction(clientId: string, etape: StageName, statut: StageStatus) {
  await requireAdmin();
  await prisma.collaborationStage.upsert({
    where: { clientId_etape: { clientId, etape } },
    update: { statut },
    create: { clientId, etape, statut },
  });
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/clients");
  revalidatePath("/portal");
}
