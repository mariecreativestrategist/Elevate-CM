"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";

export async function createInvoiceAction(clientId: string, formData: FormData) {
  await requireAdmin();
  const montant = Number(formData.get("montant"));
  const echeanceStr = String(formData.get("echeance") ?? "");
  const statut = String(formData.get("statut") ?? "en_attente") as "payee" | "en_attente" | "en_retard";
  if (!montant || !echeanceStr) return;

  let url: string | undefined;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    url = await saveUploadedFile(file, clientId, "facture");
  }

  await prisma.invoice.create({
    data: { clientId, montant, echeance: new Date(echeanceStr), statut, url },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/administratif");
  revalidatePath("/portal/administratif");
}

export async function updateInvoiceStatusAction(invoiceId: string, statut: "payee" | "en_attente" | "en_retard") {
  await requireAdmin();
  const invoice = await prisma.invoice.update({ where: { id: invoiceId }, data: { statut } });
  revalidatePath(`/admin/clients/${invoice.clientId}`);
  revalidatePath("/admin/administratif");
  revalidatePath("/portal/administratif");
}
