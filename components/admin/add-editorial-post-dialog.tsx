"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createEditorialPostAction } from "@/lib/actions/editorial-posts";

export function AddEditorialPostDialog({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Plus className="h-3.5 w-3.5" />
            Ajouter un contenu
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau contenu éditorial</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={(formData) => {
            startTransition(async () => {
              await createEditorialPostAction(clientId, formData);
              formRef.current?.reset();
              setOpen(false);
            });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="post-date">Date</Label>
              <Input id="post-date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-type">Type de contenu</Label>
              <select
                id="post-type"
                name="typeContenu"
                defaultValue="post"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
              >
                <option value="reel">Reel</option>
                <option value="carrousel">Carrousel</option>
                <option value="story">Story</option>
                <option value="post">Post</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-pilier">Pilier</Label>
            <Input id="post-pilier" name="pilier" placeholder="ex : Nouveauté, Coulisses, Éducatif..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-description">Description</Label>
            <Textarea id="post-description" name="description" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-visuel">Visuel</Label>
            <input
              id="post-visuel"
              type="file"
              name="visuel"
              accept="image/*,video/*"
              className="w-full text-xs text-muted-foreground file:mr-2 file:rounded-full file:border-0 file:bg-ink-tint file:px-3 file:py-1.5 file:text-xs file:text-ink"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Ajout..." : "Ajouter au calendrier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
