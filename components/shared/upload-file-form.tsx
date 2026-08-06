"use client";

import { useRef, useTransition } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadFileForm({
  action,
  label = "Déposer",
}: {
  action: (formData: FormData) => Promise<void>;
  label?: string;
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
      className="flex items-center gap-2"
    >
      <input
        type="file"
        name="file"
        required
        className="flex-1 text-xs text-muted-foreground file:mr-2 file:rounded-full file:border-0 file:bg-ink-tint file:px-3 file:py-1.5 file:text-xs file:text-ink"
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        <Upload className="h-3.5 w-3.5" />
        {pending ? "Envoi..." : label}
      </Button>
    </form>
  );
}
