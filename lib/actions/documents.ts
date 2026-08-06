"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { currentClientId } from "@/lib/scoping";
import { saveUploadedFile } from "@/lib/storage";
import { sendEmail, newDocumentEmail, newRequestForAdminEmail, newContractFromClientEmail } from "@/lib/email";

const TYPE_LABELS: Record<string, string> = {
  strategie: "Stratégie",
  resultats: "Résultats",
  contrat: "Contrat",
  facture: "Facture",
};

export async function uploadDocumentAction(clientId: string, type: "strategie" | "resultats" | "contrat", formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedFile(file, clientId, type);
  await prisma.document.create({
    data: { clientId, type, nomFichier: file.name, url, statut: "depose" },
  });

  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const { subject, html } = newDocumentEmail(client.nom, TYPE_LABELS[type]);
  await sendEmail({ to: client.email, subject, html });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/portal/strategie");
  revalidatePath("/portal/resultats");
  revalidatePath("/portal/administratif");
}

export async function uploadContractAsClientAction(formData: FormData) {
  const clientId = await currentClientId();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedFile(file, clientId, "contrat");
  await prisma.document.create({
    data: { clientId, type: "contrat", nomFichier: file.name, url, statut: "depose" },
  });

  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const admins = await prisma.admin.findMany();
  const { subject, html } = newContractFromClientEmail(client.nom);
  await Promise.all(admins.map((a) => sendEmail({ to: a.email, subject, html })));

  revalidatePath("/portal/administratif");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/administratif");
}

export async function deleteDocumentAction(documentId: string, clientId: string) {
  await requireAdmin();
  await prisma.document.delete({ where: { id: documentId } });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function requestDocumentAdjustmentAction(documentId: string, commentaire: string) {
  const clientId = await currentClientId();
  const doc = await prisma.document.findUniqueOrThrow({ where: { id: documentId } });
  if (doc.clientId !== clientId) throw new Error("Accès refusé");

  await prisma.modificationRequest.create({
    data: {
      clientId,
      titre: `Ajustement demandé — ${doc.nomFichier}`,
      description: commentaire,
      statut: "nouveau",
    },
  });

  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const admins = await prisma.admin.findMany();
  const { subject, html } = newRequestForAdminEmail(client.nom, `Ajustement demandé — ${doc.nomFichier}`);
  await Promise.all(admins.map((a) => sendEmail({ to: a.email, subject, html })));

  revalidatePath("/admin/demandes");
  revalidatePath("/portal/strategie");
}
