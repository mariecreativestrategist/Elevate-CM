"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentClasses, type AccentColor } from "@/lib/colors";

export type CalendarPost = {
  id: string;
  titre: string;
  datePlanifiee: Date;
  [key: string]: unknown;
};

export function MonthCalendar<T extends CalendarPost>({
  posts,
  dotColor,
  onSelectPost,
}: {
  posts: T[];
  dotColor: (post: T) => AccentColor;
  onSelectPost: (post: T) => void;
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const postsByDay = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const post of posts) {
      const key = format(post.datePlanifiee, "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(post);
      map.set(key, arr);
    }
    return map;
  }, [posts]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="font-serif text-lg capitalize text-ink">{format(month, "MMMM yyyy", { locale: fr })}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMonth(startOfMonth(new Date()))}
            className="rounded-full px-2 text-xs text-muted-foreground hover:bg-muted"
          >
            Aujourd&apos;hui
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-center">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="bg-muted py-1.5 font-mono text-[10px] uppercase text-muted-foreground">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayPosts = postsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, month);
          return (
            <div
              key={key}
              className={cn(
                "min-h-24 space-y-1 bg-card p-1.5 text-left align-top",
                !inMonth && "bg-muted/40"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px]",
                  isToday(day) ? "bg-magenta text-white" : inMonth ? "text-ink" : "text-muted-foreground/50"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="space-y-0.5">
                {dayPosts.slice(0, 3).map((post) => {
                  const c = accentClasses(dotColor(post));
                  return (
                    <button
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className={cn(
                        "flex w-full items-center gap-1.5 truncate rounded px-1 py-0.5 text-left text-[11px] hover:opacity-80",
                        c.tintBg,
                        c.text
                      )}
                      title={post.titre}
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", c.bg)} />
                      <span className="truncate">{post.titre}</span>
                    </button>
                  );
                })}
                {dayPosts.length > 3 && (
                  <p className="px-1 font-mono text-[10px] text-muted-foreground">+{dayPosts.length - 3}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
