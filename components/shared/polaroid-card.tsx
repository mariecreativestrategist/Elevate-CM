import { CONTENT_TYPE_COLORS, CONTENT_TYPE_LABELS, accentClasses } from "@/lib/colors";
import { PostStatusBadge } from "@/components/shared/badges";
import { cn } from "@/lib/utils";

export function PolaroidCard({
  titre,
  typeContenu,
  statut,
  clientNom,
  className,
}: {
  titre: string;
  typeContenu: string;
  statut: string;
  clientNom?: string;
  className?: string;
}) {
  const accent = CONTENT_TYPE_COLORS[typeContenu] ?? "magenta";
  const c = accentClasses(accent);

  return (
    <div
      className={cn(
        "w-40 shrink-0 rounded-sm bg-white p-3 pb-4 shadow-md ring-1 ring-black/5 transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      <div className={cn("flex aspect-square items-center justify-center rounded-xs", c.tintBg)}>
        <span className={cn("font-mono text-[10px] uppercase tracking-wider", c.text)}>
          {CONTENT_TYPE_LABELS[typeContenu] ?? typeContenu}
        </span>
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="line-clamp-2 font-serif text-sm leading-snug text-ink">{titre}</p>
        {clientNom && <p className="truncate text-[11px] text-muted-foreground">{clientNom}</p>}
        <PostStatusBadge statut={statut} />
      </div>
    </div>
  );
}
