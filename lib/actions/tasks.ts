"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function toggleTaskDoneAction(taskId: string) {
  await requireAdmin();
  const task = await prisma.task.findUniqueOrThrow({ where: { id: taskId } });
  await prisma.task.update({
    where: { id: taskId },
    data: { colonne: task.colonne === "termine" ? "a_faire" : "termine" },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/todo");
}

export async function moveTaskColumnAction(taskId: string, colonne: "a_faire" | "en_cours" | "en_validation" | "termine") {
  await requireAdmin();
  await prisma.task.update({ where: { id: taskId }, data: { colonne } });
  revalidatePath("/admin/todo");
  revalidatePath("/admin");
}

export async function createTaskAction(formData: FormData) {
  await requireAdmin();
  const titre = String(formData.get("titre") ?? "").trim();
  if (!titre) return;
  const clientId = String(formData.get("clientId") ?? "") || null;

  const last = await prisma.task.findFirst({ where: { colonne: "a_faire" }, orderBy: { ordre: "desc" } });

  await prisma.task.create({
    data: { titre, clientId, colonne: "a_faire", ordre: (last?.ordre ?? -1) + 1 },
  });
  revalidatePath("/admin/todo");
  revalidatePath("/admin");
}

export async function deleteTaskAction(taskId: string) {
  await requireAdmin();
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/admin/todo");
  revalidatePath("/admin");
}
