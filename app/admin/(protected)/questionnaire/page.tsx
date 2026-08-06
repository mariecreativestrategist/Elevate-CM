import { prisma } from "@/lib/prisma";
import { QuestionRow } from "@/components/admin/question-row";
import { AddQuestionForm } from "@/components/admin/add-question-form";

export default async function AdminQuestionnairePage() {
  const questions = await prisma.onboardingQuestion.findMany({ orderBy: { ordre: "asc" } });

  return (
    <div className="max-w-2xl space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Questionnaire onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Ce questionnaire est envoyé à chaque nouveau client lors de son onboarding.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <QuestionRow key={q.id} question={q} index={i} count={questions.length} />
        ))}
      </div>

      <AddQuestionForm />
    </div>
  );
}
