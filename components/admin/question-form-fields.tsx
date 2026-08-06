"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TYPE_OPTIONS = [
  { value: "texte_court", label: "Texte court" },
  { value: "texte_long", label: "Texte long" },
  { value: "choix_multiple", label: "Choix multiple" },
  { value: "upload", label: "Upload de fichier" },
];

export function QuestionFormFields({
  defaultTexte = "",
  defaultType = "texte_court",
  defaultOptions = "",
  defaultObligatoire = true,
  idPrefix,
}: {
  defaultTexte?: string;
  defaultType?: string;
  defaultOptions?: string;
  defaultObligatoire?: boolean;
  idPrefix: string;
}) {
  const [type, setType] = useState(defaultType);

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-texte`}>Question</Label>
        <Input id={`${idPrefix}-texte`} name="texte" defaultValue={defaultTexte} required />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-type`}>Type</Label>
          <select
            id={`${idPrefix}-type`}
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <label className="flex h-9 items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="obligatoire" defaultChecked={defaultObligatoire} className="accent-magenta" />
          Obligatoire
        </label>
      </div>
      {type === "choix_multiple" && (
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-options`}>Options (séparées par des virgules)</Label>
          <Input id={`${idPrefix}-options`} name="options" defaultValue={defaultOptions} placeholder="Notoriété, Conversion, ..." />
        </div>
      )}
    </div>
  );
}
