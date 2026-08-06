import type { ReactNode } from "react";
import { accentClasses, type AccentColor } from "@/lib/colors";

export function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  accent: AccentColor;
  icon?: ReactNode;
}) {
  const c = accentClasses(accent);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div
        className={`absolute right-0 top-0 h-9 w-9 ${c.bg}`}
        style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        {icon && <span className={c.text}>{icon}</span>}
      </div>
      <p className="mt-3 font-serif text-3xl text-ink">{value}</p>
    </div>
  );
}
