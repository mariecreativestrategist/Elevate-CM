"use client";

import { useTransition } from "react";
import { updateModificationRequestStatusAction } from "@/lib/actions/modification-requests";

const OPTIONS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traité" },
] as const;

export function RequestStatusSelect({ requestId, statut }: { requestId: string; statut: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={statut}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value as "nouveau" | "en_cours" | "traite";
        startTransition(() => {
          updateModificationRequestStatusAction(requestId, value);
        });
      }}
      className="shrink-0 rounded-full border border-border bg-transparent px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink outline-none focus-visible:border-ring disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
