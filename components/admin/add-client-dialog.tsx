"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
import { createClientAction } from "@/lib/actions/clients";

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
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
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await createClientAction(undefined, formData);
              if (result?.error) setError(result.error);
              else setOpen(false);
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
      </DialogContent>
    </Dialog>
  );
}
