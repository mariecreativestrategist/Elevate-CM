"use client";

import { useState, useTransition } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentClasses, accentForId, KANBAN_COLUMN_LABELS } from "@/lib/colors";
import { moveTaskColumnAction, deleteTaskAction } from "@/lib/actions/tasks";

type Column = "a_faire" | "en_cours" | "en_validation" | "termine";
type Task = { id: string; titre: string; colonne: string; client: { id: string; nom: string } | null };

const COLUMNS: Column[] = ["a_faire", "en_cours", "en_validation", "termine"];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const [pending, startTransition] = useTransition();
  const accent = task.client ? accentForId(task.client.id) : "sauge";
  const c = accentClasses(accent);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.4 : pending ? 0.6 : 1,
      }}
      className={cn("cursor-grab touch-none rounded-xl border-l-4 bg-card p-3 shadow-sm active:cursor-grabbing", c.border)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-ink">{task.titre}</p>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => startTransition(() => deleteTaskAction(task.id))}
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {task.client && <p className="mt-1 text-xs text-muted-foreground">{task.client.nom}</p>}
    </div>
  );
}

function ColumnDroppable({ colonne, tasks }: { colonne: Column; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: colonne });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[400px] flex-1 flex-col gap-2 rounded-2xl border border-border bg-muted/40 p-3",
        isOver && "bg-magenta-tint/40"
      )}
    >
      <div className="mb-1 flex items-center justify-between px-1">
        <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {KANBAN_COLUMN_LABELS[colonne]}
        </h3>
        <span className="font-mono text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </div>
  );
}

export function KanbanBoard({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newColumn = over.id as Column;
    const taskId = active.id as string;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, colonne: newColumn } : t)));
    moveTaskColumnAction(taskId, newColumn);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        {COLUMNS.map((colonne) => (
          <ColumnDroppable key={colonne} colonne={colonne} tasks={tasks.filter((t) => t.colonne === colonne)} />
        ))}
      </div>
    </DndContext>
  );
}
