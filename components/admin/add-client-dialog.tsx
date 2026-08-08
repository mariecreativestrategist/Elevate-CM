"use client";

import { useState, useTransition } from "react";
import { Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClientAction, type FormState } from "@/lib/actions/clients";

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<FormState>();
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function reset() {
    setError(undefined);
    setResult(undefined);
    setCopied(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            Ajouter un client
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>

        {result?.success ? (
          <div className="space-y-4">
            <p className={result.emailSent ? "text-sm text-sauge" : "text-sm text-corail"}>{result.success}</p>
            {result.inviteUrl && (
              <div className="space-y-2">
                <Label>Lien d&apos;invitation {result.emailSent && "(au cas où l'e-mail n'arrive pas)"}</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={result.inviteUrl} className="font-mono text-xs" />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      await navigator.clipboard.writeText(result.inviteUrl!);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Terminé
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            action={(formData) => {
              startTransition(async () => {
                const res = await createClientAction(undefined, formData);
                if (res?.error) setError(res.error);
                else setResult(res);
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de la marque</Label>
              <Input id="nom" name="nom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offre">Offre</Label>
              <Input id="offre" name="offre" placeholder="ex : Pack Stratégique" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Envoi de l'invitation..." : "Ajouter et inviter"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
