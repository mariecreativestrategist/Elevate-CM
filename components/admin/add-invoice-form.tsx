"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddInvoiceForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await action(formData);
          formRef.current?.reset();
        });
      }}
      className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-5 md:items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="inv-montant">Montant (€)</Label>
        <Input id="inv-montant" name="montant" type="number" min={0} step={0.01} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="inv-echeance">Échéance</Label>
        <Input id="inv-echeance" name="echeance" type="date" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="inv-statut">Statut</Label>
        <select
          id="inv-statut"
          name="statut"
          defaultValue="en_attente"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
        >
          <option value="en_attente">En attente</option>
          <option value="payee">Payée</option>
          <option value="en_retard">En retard</option>
        </select>
      </div>
      <div className="col-span-2 space-y-1.5 md:col-span-1">
        <Label htmlFor="inv-file">Fichier (optionnel)</Label>
        <input
          id="inv-file"
          type="file"
          name="file"
          className="w-full text-xs text-muted-foreground file:mr-2 file:rounded-full file:border-0 file:bg-ink-tint file:px-3 file:py-1.5 file:text-xs file:text-ink"
        />
      </div>
      <Button type="submit" disabled={pending} className="col-span-2 md:col-span-5">
        {pending ? "Ajout..." : "Ajouter la facture"}
      </Button>
    </form>
  );
}
