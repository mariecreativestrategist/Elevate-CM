"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/actions/auth";

export function LoginForm({
  action,
  submitLabel,
  forgotHref,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  forgotHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connexion..." : submitLabel}
      </Button>
      {forgotHref && (
        <p className="text-center text-sm text-muted-foreground">
          <Link href={forgotHref} className="underline hover:text-ink">
            Mot de passe oublié ?
          </Link>
        </p>
      )}
    </form>
  );
}
