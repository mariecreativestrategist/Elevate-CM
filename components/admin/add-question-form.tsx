"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionFormFields } from "@/components/admin/question-form-fields";
import { createQuestionAction } from "@/lib/actions/onboarding-questions";

export function AddQuestionForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Ajouter une question
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createQuestionAction(formData);
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <QuestionFormFields idPrefix="new" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          Ajouter
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
