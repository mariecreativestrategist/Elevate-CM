"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function createQuestionAction(formData: FormData) {
  await requireAdmin();
  const texte = String(formData.get("texte") ?? "").trim();
  const type = String(formData.get("type") ?? "texte_court") as
    | "texte_court"
    | "texte_long"
    | "choix_multiple"
    | "upload";
  const obligatoire = formData.get("obligatoire") === "on";
  const optionsRaw = String(formData.get("options") ?? "").trim();
  const options =
    type === "choix_multiple"
      ? JSON.stringify(
          optionsRaw
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        )
      : null;
  if (!texte) return;

  const last = await prisma.onboardingQuestion.findFirst({ orderBy: { ordre: "desc" } });

  await prisma.onboardingQuestion.create({
    data: { texte, type, obligatoire, options, ordre: (last?.ordre ?? -1) + 1 },
  });

  revalidatePath("/admin/questionnaire");
}

export async function updateQuestionAction(questionId: string, formData: FormData) {
  await requireAdmin();
  const texte = String(formData.get("texte") ?? "").trim();
  const type = String(formData.get("type") ?? "texte_court") as
    | "texte_court"
    | "texte_long"
    | "choix_multiple"
    | "upload";
  const obligatoire = formData.get("obligatoire") === "on";
  const optionsRaw = String(formData.get("options") ?? "").trim();
  const options =
    type === "choix_multiple"
      ? JSON.stringify(
          optionsRaw
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        )
      : null;
  if (!texte) return;

  await prisma.onboardingQuestion.update({
    where: { id: questionId },
    data: { texte, type, obligatoire, options },
  });

  revalidatePath("/admin/questionnaire");
}

export async function deleteQuestionAction(questionId: string) {
  await requireAdmin();
  await prisma.onboardingQuestion.delete({ where: { id: questionId } });
  revalidatePath("/admin/questionnaire");
}

export async function moveQuestionAction(questionId: string, direction: "up" | "down") {
  await requireAdmin();
  const questions = await prisma.onboardingQuestion.findMany({ orderBy: { ordre: "asc" } });
  const index = questions.findIndex((q) => q.id === questionId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= questions.length) return;

  const a = questions[index];
  const b = questions[swapIndex];

  await prisma.$transaction([
    prisma.onboardingQuestion.update({ where: { id: a.id }, data: { ordre: b.ordre } }),
    prisma.onboardingQuestion.update({ where: { id: b.id }, data: { ordre: a.ordre } }),
  ]);

  revalidatePath("/admin/questionnaire");
}
