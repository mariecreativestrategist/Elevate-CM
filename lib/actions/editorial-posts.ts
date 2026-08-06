"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import { CONTENT_TYPE_LABELS } from "@/lib/colors";

export async function createEditorialPostAction(clientId: string, formData: FormData) {
  await requireAdmin();

  const dateStr = String(formData.get("date") ?? "");
  const typeContenu = String(formData.get("typeContenu") ?? "post") as
    | "reel"
    | "carrousel"
    | "story"
    | "post"
    | "tiktok";
  const pilier = String(formData.get("pilier") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!dateStr) return;

  let visuelUrl: string | undefined;
  const file = formData.get("visuel");
  if (file instanceof File && file.size > 0) {
    visuelUrl = await saveUploadedFile(file, clientId, "editorial");
  }

  const titre = pilier || CONTENT_TYPE_LABELS[typeContenu] || "Publication";

  await prisma.editorialPost.create({
    data: {
      clientId,
      titre,
      typeContenu,
      pilier,
      description,
      visuelUrl,
      datePlanifiee: new Date(dateStr),
      statut: "planifie",
    },
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/calendrier");
  revalidatePath("/portal/calendrier");
  revalidatePath("/portal");
  revalidatePath("/admin");
}

export async function deleteEditorialPostAction(postId: string, clientId: string) {
  await requireAdmin();
  await prisma.editorialPost.delete({ where: { id: postId } });
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/calendrier");
  revalidatePath("/portal/calendrier");
}
