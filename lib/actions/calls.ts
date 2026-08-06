"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function createCallAction(clientId: string, formData: FormData) {
  await requireAdmin();
  const titre = String(formData.get("titre") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const dureeMin = Number(formData.get("dureeMin") ?? 30);
  const lienVisio = String(formData.get("lienVisio") ?? "").trim() || null;
  if (!titre || !dateStr) return;

  await prisma.call.create({
    data: { clientId, titre, date: new Date(dateStr), dureeMin, lienVisio },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin");
  revalidatePath("/portal");
}

export async function deleteCallAction(callId: string, clientId: string) {
  await requireAdmin();
  await prisma.call.delete({ where: { id: callId } });
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin");
}
