"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/lib/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enregistrement..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
}
