import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { OnboardingForm } from "@/components/portal/onboarding-form";

export default async function PortalOnboardingPage() {
  const clientId = await currentClientId();

  const [questions, answers, stage] = await Promise.all([
    prisma.onboardingQuestion.findMany({ orderBy: { ordre: "asc" } }),
    prisma.onboardingAnswer.findMany({ where: { clientId } }),
    prisma.collaborationStage.findUnique({ where: { clientId_etape: { clientId, etape: "onboarding" } } }),
  ]);

  const answerMap = new Map(answers.map((a) => [a.questionId, a.reponse]));
  const isSubmitted = stage?.statut === "complete";

  return (
    <div className="max-w-2xl space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Onboarding</h1>
        <p className="text-sm text-muted-foreground">
          {isSubmitted
            ? "Vos réponses ont été soumises à l'agence."
            : "Répondez au questionnaire pour démarrer la collaboration. Vous pouvez enregistrer un brouillon et revenir plus tard."}
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          {questions.map((q) => {
            const reponse = answerMap.get(q.id);
            if (!reponse) return null;
            return (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="text-xs text-muted-foreground">{q.texte}</p>
                <p className="mt-1 text-sm text-ink">
                  {q.type === "upload" ? (
                    <a href={reponse} className="text-magenta hover:underline">
                      Voir le fichier déposé
                    </a>
                  ) : (
                    reponse
                  )}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <OnboardingForm questions={questions} answers={answerMap} />
      )}
    </div>
  );
}
