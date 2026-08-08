"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { sendEmail, inviteClientEmail } from "@/lib/email";

export type FormState =
  | { error?: string; success?: string; inviteUrl?: string; emailSent?: boolean }
  | undefined;

const STAGES = ["onboarding", "strategie", "calendrier", "resultats"] as const;

export async function createClientAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const offre = String(formData.get("offre") ?? "").trim();

  if (!nom || !email || !offre) {
    return { error: "Merci de renseigner le nom, l'e-mail et l'offre." };
  }

  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un client avec cet e-mail existe déjà." };
  }

  const placeholderPassword = randomBytes(24).toString("hex");
  const passwordHash = await hashPassword(placeholderPassword);

  const client = await prisma.client.create({
    data: {
      nom,
      email,
      passwordHash,
      offre,
      stages: {
        create: STAGES.map((etape) => ({ etape, statut: "a_faire" as const })),
      },
      conversation: { create: {} },
    },
  });

  const token = randomBytes(24).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      token,
      role: "client",
      clientId: client.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 jours pour l'invitation initiale
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/portal/login/reset?token=${token}`;
  const { subject, html } = inviteClientEmail(nom, inviteUrl);
  const { ok: emailSent } = await sendEmail({ to: email, subject, html });

  revalidatePath("/admin/clients");
  return {
    success: emailSent
      ? `${nom} a été ajouté·e et invité·e par e-mail.`
      : `${nom} a été ajouté·e, mais l'e-mail d'invitation n'a pas pu être envoyé. Transmets-lui ce lien toi-même :`,
    inviteUrl,
    emailSent,
  };
}

export async function toggleClientStatusAction(clientId: string) {
  await requireAdmin();
  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  await prisma.client.update({
    where: { id: clientId },
    data: { statut: client.statut === "actif" ? "archive" : "actif" },
  });
  revalidatePath("/admin/clients");
}

/**
 * Suppression définitive d'un client — efface aussi en cascade tout ce qui
 * lui est lié (documents, factures, publications, messages, demandes,
 * appels, tâches). Irréversible : préférer l'archivage sauf besoin explicite
 * de tout effacer.
 */
export async function deleteClientAction(clientId: string) {
  await requireAdmin();
  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/admin/clients");
}
