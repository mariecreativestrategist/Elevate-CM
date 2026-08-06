"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAdminProfileAction } from "@/lib/actions/account";

export function AccountProfileForm({ nom, email }: { nom: string; email: string }) {
  const [state, formAction, pending] = useActionState(updateAdminProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-lg text-ink">Profil</h2>
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input id="nom" name="nom" defaultValue={nom} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail de connexion</Label>
        <Input id="email" name="email" type="email" defaultValue={email} required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-sauge">{state.success}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
