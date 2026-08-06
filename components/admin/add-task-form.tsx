"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTaskAction } from "@/lib/actions/tasks";

export function AddTaskForm({ clients }: { clients: { id: string; nom: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createTaskAction(formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <Input name="titre" placeholder="Nouvelle tâche..." required className="max-w-xs" />
      <select
        name="clientId"
        defaultValue=""
        className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
      >
        <option value="">Aucun client</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={pending}>
        <Plus className="h-4 w-4" />
        Ajouter
      </Button>
    </form>
  );
}
