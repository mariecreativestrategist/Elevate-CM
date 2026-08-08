"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteClientAction } from "@/lib/actions/clients";

export function DeleteClientButton({ clientId, clientNom }: { clientId: string; clientNom: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            title="Supprimer définitivement"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer {clientNom} ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est définitive : tous les documents, factures, publications, messages, demandes et appels
            liés à ce client seront aussi supprimés. Si tu veux juste le désactiver temporairement, utilise plutôt
            "Archiver".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            render={
              <Button
                variant="destructive"
                disabled={pending}
                onClick={() => startTransition(() => deleteClientAction(clientId))}
              >
                {pending ? "Suppression..." : "Supprimer définitivement"}
              </Button>
            }
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
