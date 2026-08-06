import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { AddTaskForm } from "@/components/admin/add-task-form";

export default async function AdminTodoPage() {
  const [tasks, clients] = await Promise.all([
    prisma.task.findMany({ include: { client: true }, orderBy: { ordre: "asc" } }),
    prisma.client.findMany({ where: { statut: "actif" }, orderBy: { nom: "asc" } }),
  ]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Todo</h1>
        <p className="text-sm text-muted-foreground">Glissez-déposez les tâches entre colonnes.</p>
      </div>
      <AddTaskForm clients={clients.map((c) => ({ id: c.id, nom: c.nom }))} />
      <KanbanBoard tasks={tasks} />
    </div>
  );
}
