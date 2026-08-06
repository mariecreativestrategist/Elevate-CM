"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { saveUploadedFile } from "@/lib/storage";

async function saveAnswers(clientId: string, formData: FormData) {
  const questions = await prisma.onboardingQuestion.findMany();

  for (const q of questions) {
    if (q.type === "upload") {
      const file = formData.get(`q_${q.id}`);
      if (file instanceof File && file.size > 0) {
        const url = await saveUploadedFile(file, clientId, "onboarding");
        await prisma.onboardingAnswer.upsert({
          where: { clientId_questionId: { clientId, questionId: q.id } },
          update: { reponse: url },
          create: { clientId, questionId: q.id, reponse: url },
        });
      }
      continue;
    }

    const value = formData.get(`q_${q.id}`);
    if (value === null) continue;
    const reponse = String(value).trim();
    if (!reponse) continue;

    await prisma.onboardingAnswer.upsert({
      where: { clientId_questionId: { clientId, questionId: q.id } },
      update: { reponse },
      create: { clientId, questionId: q.id, reponse },
    });
  }
}

export async function saveOnboardingDraftAction(formData: FormData) {
  const clientId = await currentClientId();
  await saveAnswers(clientId, formData);

  await prisma.collaborationStage.upsert({
    where: { clientId_etape: { clientId, etape: "onboarding" } },
    update: { statut: "en_cours" },
    create: { clientId, etape: "onboarding", statut: "en_cours" },
  });

  revalidatePath("/portal/onboarding");
}

export async function submitOnboardingAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const clientId = await currentClientId();
  await saveAnswers(clientId, formData);

  const questions = await prisma.onboardingQuestion.findMany({ where: { obligatoire: true } });
  const answers = await prisma.onboardingAnswer.findMany({ where: { clientId } });
  const answered = new Set(answers.filter((a) => a.reponse).map((a) => a.questionId));
  const missing = questions.filter((q) => !answered.has(q.id));

  if (missing.length > 0) {
    return { error: `Merci de répondre aux questions obligatoires : ${missing.map((q) => q.texte).join(", ")}` };
  }

  await prisma.collaborationStage.upsert({
    where: { clientId_etape: { clientId, etape: "onboarding" } },
    update: { statut: "complete" },
    create: { clientId, etape: "onboarding", statut: "complete" },
  });

  const strategieStage = await prisma.collaborationStage.findUnique({
    where: { clientId_etape: { clientId, etape: "strategie" } },
  });
  if (!strategieStage || strategieStage.statut === "a_faire") {
    await prisma.collaborationStage.upsert({
      where: { clientId_etape: { clientId, etape: "strategie" } },
      update: { statut: "en_cours" },
      create: { clientId, etape: "strategie", statut: "en_cours" },
    });
  }

  revalidatePath("/portal/onboarding");
  revalidatePath("/portal");
  revalidatePath(`/admin/clients/${clientId}`);
}
