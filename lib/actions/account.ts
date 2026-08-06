"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword, verifyPassword, createSessionCookie } from "@/lib/auth";

export type FormState = { error?: string; success?: string } | undefined;

export async function updateAdminProfileAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();

  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!nom || !email) {
    return { error: "Merci de renseigner le nom et l'e-mail." };
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing && existing.id !== session.sub) {
    return { error: "Un autre compte admin utilise déjà cet e-mail." };
  }

  const admin = await prisma.admin.update({ where: { id: session.sub }, data: { nom, email } });

  // Le cookie de session contient nom/email : on le renouvelle pour refléter le changement immédiatement.
  await createSessionCookie({ sub: admin.id, role: "admin", nom: admin.nom, email: admin.email });

  revalidatePath("/admin/parametres");
  return { success: "Profil mis à jour." };
}

export async function changeAdminPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const admin = await prisma.admin.findUniqueOrThrow({ where: { id: session.sub } });
  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.admin.update({ where: { id: session.sub }, data: { passwordHash } });

  return { success: "Mot de passe mis à jour." };
}
