import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  INVOICE_STATUS_LABELS,
  POST_STATUS_LABELS,
  REQUEST_STATUS_LABELS,
  accentClasses,
  accentForId,
  type AccentColor,
} from "@/lib/colors";

function Pill({ children, accent }: { children: ReactNode; accent: AccentColor }) {
  const c = accentClasses(accent);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide",
        c.tintBg,
        c.text
      )}
    >
      {children}
    </span>
  );
}

export function NeutralPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ink-tint px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-ink">
      {children}
    </span>
  );
}

export function ColorDot({ accent, className }: { accent: AccentColor; className?: string }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", accentClasses(accent).bg, className)} />;
}

export function OfferBadge({ offre }: { offre: string }) {
  return <NeutralPill>{offre}</NeutralPill>;
}

export function PostStatusBadge({ statut }: { statut: string }) {
  const accent: AccentColor =
    statut === "publie" ? "sauge" : statut === "approuve" ? "magenta" : statut === "a_valider" ? "butter" : "corail";
  return <Pill accent={accent}>{POST_STATUS_LABELS[statut] ?? statut}</Pill>;
}

export function RequestStatusBadge({ statut }: { statut: string }) {
  const accent: AccentColor = statut === "traite" ? "sauge" : statut === "en_cours" ? "butter" : "corail";
  return <Pill accent={accent}>{REQUEST_STATUS_LABELS[statut] ?? statut}</Pill>;
}

export function InvoiceStatusBadge({ statut }: { statut: string }) {
  const accent: AccentColor = statut === "payee" ? "sauge" : statut === "en_retard" ? "corail" : "butter";
  return <Pill accent={accent}>{INVOICE_STATUS_LABELS[statut] ?? statut}</Pill>;
}

export function ClientColorDot({ clientId, className }: { clientId: string; className?: string }) {
  return <ColorDot accent={accentForId(clientId)} className={className} />;
}
