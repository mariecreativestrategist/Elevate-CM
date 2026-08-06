"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { authenticate, clearSessionCookie, createSessionCookie, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, requestPasswordResetEmail } from "@/lib/email";

export type FormState = { error?: string; success?: string } | undefined;

async function login(role: "admin" | "client", _prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Merci de renseigner e-mail et mot de passe." };
  }

  const session = await authenticate(email, password);
  if (!session || session.role !== role) {
    return { error: "Identifiants incorrects." };
  }

  await createSessionCookie(session);
  redirect(role === "admin" ? "/admin" : "/portal");
}

export async function loginAdminAction(prevState: FormState, formData: FormData) {
  return login("admin", prevState, formData);
}

export async function loginClientAction(prevState: FormState, formData: FormData) {
  return login("client", prevState, formData);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}

async function requestPasswordReset(
  role: "admin" | "client",
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Merci de renseigner votre e-mail." };

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

  // Réponse identique que le compte existe ou non (pas d'énumération de comptes).
  if (role === "client") {
    const client = await prisma.client.findUnique({ where: { email } });
    if (client) {
      await prisma.passwordResetToken.create({
        data: { token, role: "client", clientId: client.id, expiresAt },
      });
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/portal/login/reset?token=${token}`;
      const { subject, html } = requestPasswordResetEmail(client.nom, resetUrl);
      await sendEmail({ to: client.email, subject, html });
    }
  } else {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      await prisma.passwordResetToken.create({
        data: { token, role: "admin", adminId: admin.id, expiresAt },
      });
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/login/reset?token=${token}`;
      const { subject, html } = requestPasswordResetEmail(admin.nom, resetUrl);
      await sendEmail({ to: admin.email, subject, html });
    }
  }

  return { success: "Si un compte existe avec cet e-mail, un lien de réinitialisation vient d'être envoyé." };
}

export async function requestClientPasswordResetAction(prevState: FormState, formData: FormData) {
  return requestPasswordReset("client", prevState, formData);
}

export async function requestAdminPasswordResetAction(prevState: FormState, formData: FormData) {
  return requestPasswordReset("admin", prevState, formData);
}

export async function resetPasswordAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!token || password.length < 8) {
    return { error: "Mot de passe trop court (8 caractères minimum) ou lien invalide." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Ce lien de réinitialisation est invalide ou expiré." };
  }

  const passwordHash = await hashPassword(password);

  if (resetToken.role === "client" && resetToken.clientId) {
    await prisma.$transaction([
      prisma.client.update({ where: { id: resetToken.clientId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);
    redirect("/portal/login");
  }

  if (resetToken.role === "admin" && resetToken.adminId) {
    await prisma.$transaction([
      prisma.admin.update({ where: { id: resetToken.adminId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);
    redirect("/admin/login");
  }

  return { error: "Ce lien de réinitialisation est invalide ou expiré." };
}
