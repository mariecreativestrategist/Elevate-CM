import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS } from "@/lib/colors";

export type StageStatus = "a_faire" | "en_cours" | "complete";

export function Stepper({
  stages,
  compact = false,
}: {
  stages: { etape: string; statut: StageStatus }[];
  compact?: boolean;
}) {
  return (
    <ol className="flex w-full items-center">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        return (
          <li key={stage.etape} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 font-mono text-xs",
                  compact ? "h-6 w-6" : "h-8 w-8",
                  stage.statut === "complete" && "border-magenta bg-magenta text-white",
                  stage.statut === "en_cours" && "border-magenta bg-magenta-tint text-magenta",
                  stage.statut === "a_faire" && "border-border bg-card text-muted-foreground"
                )}
              >
                {stage.statut === "complete" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {!compact && (
                <span
                  className={cn(
                    "text-center text-xs",
                    stage.statut === "a_faire" ? "text-muted-foreground" : "text-ink font-medium"
                  )}
                >
                  {STAGE_LABELS[stage.etape] ?? stage.etape}
                </span>
              )}
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  stage.statut === "complete" ? "bg-magenta" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
