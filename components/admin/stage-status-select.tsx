"use client";

import { useTransition } from "react";
import { setStageStatusAction } from "@/lib/actions/stages";

const OPTIONS = [
  { value: "a_faire", label: "À faire" },
  { value: "en_cours", label: "En cours" },
  { value: "complete", label: "Complété" },
] as const;

export function StageStatusSelect({
  clientId,
  etape,
  statut,
}: {
  clientId: string;
  etape: "onboarding" | "strategie" | "calendrier" | "resultats";
  statut: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={statut}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value as "a_faire" | "en_cours" | "complete";
        startTransition(() => {
          setStageStatusAction(clientId, etape, value);
        });
      }}
      className="rounded-full border border-border bg-transparent px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink outline-none focus-visible:border-ring disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
