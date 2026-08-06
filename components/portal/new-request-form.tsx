"use client";

import { useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createModificationRequestAction } from "@/lib/actions/modification-requests";

export function NewRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const titre = String(formData.get("titre") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        if (!titre || !description) return;
        startTransition(async () => {
          await createModificationRequestAction(null, titre, description);
          formRef.current?.reset();
          setDone(true);
          setTimeout(() => setDone(false), 3000);
        });
      }}
      className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="req-titre">Titre</Label>
        <Input id="req-titre" name="titre" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="req-description">Description</Label>
        <Textarea id="req-description" name="description" rows={4} required />
      </div>
      {done && <p className="text-sm text-sauge">Demande envoyée à l&apos;agence.</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi..." : "Envoyer la demande"}
      </Button>
    </form>
  );
}
