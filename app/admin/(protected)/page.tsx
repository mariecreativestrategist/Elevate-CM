import { endOfDay, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Users, Clock, ImageIcon, CheckSquare2, MessageCircle, ListTodo, PhoneCall } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { PolaroidCard } from "@/components/shared/polaroid-card";
import { toggleTaskDoneAction } from "@/lib/actions/tasks";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [
    clientsActifs,
    contenusEnAttente,
    publicationsDuJour,
    validationsEnAttente,
    messagesNonLus,
    tachesAFaire,
    appelsAVenir,
  ] = await Promise.all([
    prisma.client.count({ where: { statut: "actif" } }),
    prisma.editorialPost.count({ where: { statut: "a_valider" } }),
    prisma.editorialPost.findMany({
      where: { datePlanifiee: { gte: todayStart, lte: todayEnd } },
      include: { client: true },
      orderBy: { datePlanifiee: "asc" },
    }),
    prisma.modificationRequest.count({ where: { statut: "nouveau" } }),
    prisma.message.count({ where: { expediteurRole: "client", lu: false } }),
    prisma.task.findMany({
      where: { colonne: "a_faire" },
      include: { client: true },
      orderBy: { ordre: "asc" },
      take: 6,
    }),
    prisma.call.findMany({
      where: { date: { gte: now } },
      include: { client: true },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{format(now, "EEEE d MMMM yyyy", { locale: fr })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Clients actifs" value={clientsActifs} accent="magenta" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Contenus en attente" value={contenusEnAttente} accent="corail" icon={<ImageIcon className="h-4 w-4" />} />
        <StatCard label="Publications du jour" value={publicationsDuJour.length} accent="butter" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Validations en attente" value={validationsEnAttente} accent="sauge" icon={<CheckSquare2 className="h-4 w-4" />} />
        <StatCard label="Messages non lus" value={messagesNonLus} accent="magenta" icon={<MessageCircle className="h-4 w-4" />} />
        <StatCard label="Tâches à faire" value={tachesAFaire.length} accent="corail" icon={<ListTodo className="h-4 w-4" />} />
        <StatCard label="Appels à venir" value={appelsAVenir.length} accent="butter" icon={<PhoneCall className="h-4 w-4" />} />
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-xl text-ink">Publications du jour</h2>
        {publicationsDuJour.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune publication planifiée aujourd&apos;hui.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {publicationsDuJour.map((post) => (
              <PolaroidCard
                key={post.id}
                titre={post.titre}
                typeContenu={post.typeContenu}
                statut={post.statut}
                clientNom={post.client.nom}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-ink">Tâches à faire</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
            {tachesAFaire.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Aucune tâche en attente.</p>
            ) : (
              <ul className="divide-y divide-border">
                {tachesAFaire.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 px-3 py-2.5">
                    <form action={toggleTaskDoneAction.bind(null, task.id)}>
                      <button
                        type="submit"
                        className={cn(
                          "h-4 w-4 shrink-0 rounded border-2 border-muted-foreground/40 transition-colors hover:border-magenta"
                        )}
                        aria-label="Marquer comme terminé"
                      />
                    </form>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{task.titre}</p>
                      {task.client && <p className="truncate text-xs text-muted-foreground">{task.client.nom}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-ink">Appels à venir</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
            {appelsAVenir.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Aucun appel programmé.</p>
            ) : (
              <ul className="divide-y divide-border">
                {appelsAVenir.map((call) => (
                  <li key={call.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{call.titre}</p>
                      <p className="truncate text-xs text-muted-foreground">{call.client.nom}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {format(call.date, "d MMM · HH:mm", { locale: fr })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
