"use client";

import { useActionState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { changeAdminPasswordAction } from "@/lib/actions/account";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeAdminPasswordAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-lg text-ink">Mot de passe</h2>
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-sauge">{state.success}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
