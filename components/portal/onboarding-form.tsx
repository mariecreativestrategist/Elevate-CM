"use client";

import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveOnboardingDraftAction, submitOnboardingAction } from "@/lib/actions/onboarding";

type Question = {
  id: string;
  texte: string;
  type: string;
  options: string | null;
  obligatoire: boolean;
};

export function OnboardingForm({
  questions,
  answers,
}: {
  questions: Question[];
  answers: Map<string, string | null>;
}) {
  const [state, formAction, pending] = useActionState(submitOnboardingAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      {questions.map((q) => {
        const existing = answers.get(q.id) ?? "";
        const name = `q_${q.id}`;
        return (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Label htmlFor={name} className="text-sm text-ink">
              {q.texte}
              {q.obligatoire && <span className="text-magenta"> *</span>}
            </Label>
            <div className="mt-3">
              {q.type === "texte_court" && <Input id={name} name={name} defaultValue={existing} />}
              {q.type === "texte_long" && <Textarea id={name} name={name} defaultValue={existing} rows={4} />}
              {q.type === "choix_multiple" && (
                <div className="flex flex-wrap gap-3">
                  {(JSON.parse(q.options ?? "[]") as string[]).map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm has-[:checked]:border-magenta has-[:checked]:bg-magenta-tint has-[:checked]:text-magenta"
                    >
                      <input type="radio" name={name} value={opt} defaultChecked={existing === opt} className="accent-magenta" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "upload" && (
                <div className="space-y-2">
                  {existing && (
                    <a href={existing} className="block text-xs text-magenta hover:underline">
                      Fichier déjà déposé — voir
                    </a>
                  )}
                  <input
                    id={name}
                    type="file"
                    name={name}
                    className="w-full text-xs text-muted-foreground file:mr-2 file:rounded-full file:border-0 file:bg-ink-tint file:px-3 file:py-1.5 file:text-xs file:text-ink"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" formAction={saveOnboardingDraftAction} variant="outline" disabled={pending}>
          Enregistrer le brouillon
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Envoi..." : "Soumettre"}
        </Button>
      </div>
    </form>
  );
}
