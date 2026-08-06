"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddCallForm({
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
      <div className="col-span-2 space-y-1.5 md:col-span-2">
        <Label htmlFor="call-titre">Titre</Label>
        <Input id="call-titre" name="titre" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="call-date">Date &amp; heure</Label>
        <Input id="call-date" name="date" type="datetime-local" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="call-duree">Durée (min)</Label>
        <Input id="call-duree" name="dureeMin" type="number" defaultValue={30} min={5} step={5} />
      </div>
      <div className="col-span-2 space-y-1.5 md:col-span-1">
        <Label htmlFor="call-lien">Lien visio</Label>
        <Input id="call-lien" name="lienVisio" placeholder="https://..." />
      </div>
      <Button type="submit" disabled={pending} className="col-span-2 md:col-span-5">
        {pending ? "Ajout..." : "Programmer l'appel"}
      </Button>
    </form>
  );
}
