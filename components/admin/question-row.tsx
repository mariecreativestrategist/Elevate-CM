"use client";

import { useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionFormFields } from "@/components/admin/question-form-fields";
import { deleteQuestionAction, moveQuestionAction, updateQuestionAction } from "@/lib/actions/onboarding-questions";

const TYPE_LABELS: Record<string, string> = {
  texte_court: "Texte court",
  texte_long: "Texte long",
  choix_multiple: "Choix multiple",
  upload: "Upload",
};

type Question = {
  id: string;
  texte: string;
  type: string;
  options: string | null;
  obligatoire: boolean;
};

export function QuestionRow({ question, index, count }: { question: Question; index: number; count: number }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (editing) {
    return (
      <form
        ref={formRef}
        action={(formData) => {
          startTransition(async () => {
            await updateQuestionAction(question.id, formData);
            setEditing(false);
          });
        }}
        className="space-y-3 rounded-2xl border border-magenta/30 bg-magenta-tint/20 p-4"
      >
        <QuestionFormFields
          idPrefix={question.id}
          defaultTexte={question.texte}
          defaultType={question.type}
          defaultOptions={question.options ? JSON.parse(question.options).join(", ") : ""}
          defaultObligatoire={question.obligatoire}
        />
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            Enregistrer
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>
            Annuler
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm text-ink">{question.texte}</p>
        <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">
          {TYPE_LABELS[question.type]} {question.obligatoire && "· Obligatoire"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          disabled={index === 0 || pending}
          onClick={() => startTransition(() => moveQuestionAction(question.id, "up"))}
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          disabled={index === count - 1 || pending}
          onClick={() => startTransition(() => moveQuestionAction(question.id, "down"))}
          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setEditing(true)} className="rounded p-1 text-muted-foreground hover:bg-muted">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => startTransition(() => deleteQuestionAction(question.id))}
          className="rounded p-1 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
