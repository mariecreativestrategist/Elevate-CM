"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { currentClientId } from "@/lib/scoping";
import { sendEmail, newMessageForAdminEmail } from "@/lib/email";

async function getOrCreateConversation(clientId: string) {
  return prisma.conversation.upsert({
    where: { clientId },
    update: {},
    create: { clientId },
  });
}

export async function sendMessageAsAdminAction(clientId: string, formData: FormData) {
  const session = await requireAdmin();
  const contenu = String(formData.get("contenu") ?? "").trim();
  if (!contenu) return;

  const conversation = await getOrCreateConversation(clientId);
  await prisma.message.create({
    data: { conversationId: conversation.id, expediteurRole: "admin", adminId: session.sub, contenu, lu: false },
  });

  revalidatePath("/admin/chat");
  revalidatePath("/portal/chat");
}

export async function sendMessageAsClientAction(formData: FormData) {
  const clientId = await currentClientId();
  const contenu = String(formData.get("contenu") ?? "").trim();
  if (!contenu) return;

  const conversation = await getOrCreateConversation(clientId);
  await prisma.message.create({
    data: { conversationId: conversation.id, expediteurRole: "client", contenu, lu: false },
  });

  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const admins = await prisma.admin.findMany();
  const { subject, html } = newMessageForAdminEmail(client.nom);
  await Promise.all(admins.map((a) => sendEmail({ to: a.email, subject, html })));

  revalidatePath("/portal/chat");
  revalidatePath("/admin/chat");
}
