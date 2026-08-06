"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { currentClientId } from "@/lib/scoping";
import { sendEmail, newRequestForAdminEmail, requestTreatedEmail } from "@/lib/email";

export async function createModificationRequestAction(
  postId: string | null,
  titre: string,
  description: string
) {
  const clientId = await currentClientId();

  if (postId) {
    const post = await prisma.editorialPost.findUniqueOrThrow({ where: { id: postId } });
    if (post.clientId !== clientId) throw new Error("Accès refusé");
  }

  await prisma.modificationRequest.create({
    data: { clientId, editorialPostId: postId, titre, description, statut: "nouveau" },
  });

  const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
  const admins = await prisma.admin.findMany();
  const { subject, html } = newRequestForAdminEmail(client.nom, titre);
  await Promise.all(admins.map((a) => sendEmail({ to: a.email, subject, html })));

  revalidatePath("/admin/demandes");
  revalidatePath("/admin/calendrier");
  revalidatePath("/portal/calendrier");
  revalidatePath("/portal/chat");
}

export async function approvePostAction(postId: string) {
  const clientId = await currentClientId();
  const post = await prisma.editorialPost.findUniqueOrThrow({ where: { id: postId } });
  if (post.clientId !== clientId) throw new Error("Accès refusé");

  await prisma.editorialPost.update({ where: { id: postId }, data: { statut: "approuve" } });

  revalidatePath("/portal/calendrier");
  revalidatePath("/admin/calendrier");
  revalidatePath("/admin");
}

export async function updateModificationRequestStatusAction(
  requestId: string,
  statut: "nouveau" | "en_cours" | "traite"
) {
  await requireAdmin();
  const request = await prisma.modificationRequest.update({
    where: { id: requestId },
    data: { statut },
    include: { client: true },
  });

  if (statut === "traite") {
    const { subject, html } = requestTreatedEmail(request.client.nom, request.titre);
    await sendEmail({ to: request.client.email, subject, html });
  }

  revalidatePath("/admin/demandes");
  revalidatePath("/portal/chat");
  revalidatePath("/portal/strategie");
}
