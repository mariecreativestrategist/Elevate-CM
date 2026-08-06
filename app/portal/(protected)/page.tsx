import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, ImageIcon, MessageCircle, Milestone, PhoneCall } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentClientId } from "@/lib/scoping";
import { Stepper } from "@/components/shared/stepper";
import { StatCard } from "@/components/shared/stat-card";
import { PolaroidCard } from "@/components/shared/polaroid-card";
import { STAGE_LABELS } from "@/lib/colors";

const STAGE_ORDER = ["onboarding", "strategie", "calendrier", "resultats"] as const;

export default async function PortalDashboardPage() {
  const clientId = await currentClientId();
  const now = new Date();

  const [client, stagesRaw, conversation, prochainesPublications, prochainAppel, contenusAValider] =
    await Promise.all([
      prisma.client.findUniqueOrThrow({ where: { id: clientId } }),
      prisma.collaborationStage.findMany({ where: { clientId } }),
      prisma.conversation.findUnique({ where: { clientId } }),
      prisma.editorialPost.findMany({
        where: { clientId, datePlanifiee: { gte: now } },
        orderBy: { datePlanifiee: "asc" },
        take: 4,
      }),
      prisma.call.findFirst({ where: { clientId, date: { gte: now } }, orderBy: { date: "asc" } }),
      prisma.editorialPost.count({ where: { clientId, statut: "a_valider" } }),
    ]);

  const messagesNonLus = conversation
    ? await prisma.message.count({ where: { conversationId: conversation.id, expediteurRole: "admin", lu: false } })
    : 0;

  const stages = STAGE_ORDER.map(
    (etape) => stagesRaw.find((s) => s.etape === etape) ?? { etape, statut: "a_faire" as const }
  );
  const etapeActuelle = stages.find((s) => s.statut !== "complete") ?? stages[stages.length - 1];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Bonjour {client.nom}</h1>
        <p className="text-sm text-muted-foreground">{format(now, "EEEE d MMMM yyyy", { locale: fr })}</p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Stepper stages={stages} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Étape actuelle"
          value={STAGE_LABELS[etapeActuelle.etape]}
          accent="magenta"
          icon={<Milestone className="h-4 w-4" />}
        />
        <StatCard
          label="Prochaine publication"
          value={prochainesPublications[0] ? format(prochainesPublications[0].datePlanifiee, "d MMM", { locale: fr }) : "—"}
          accent="corail"
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <StatCard label="Contenus à valider" value={contenusAValider} accent="butter" icon={<ImageIcon className="h-4 w-4" />} />
        <StatCard label="Messages non lus" value={messagesNonLus} accent="sauge" icon={<MessageCircle className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-serif text-xl text-ink">Prochaines publications</h2>
          {prochainesPublications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Rien de planifié pour l&apos;instant.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {prochainesPublications.map((post) => (
                <PolaroidCard key={post.id} titre={post.titre} typeContenu={post.typeContenu} statut={post.statut} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-xl text-ink">Prochain appel</h2>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            {!prochainAppel ? (
              <p className="text-sm text-muted-foreground">Aucun appel programmé.</p>
            ) : (
              <div className="flex items-start gap-3">
                <PhoneCall className="mt-0.5 h-5 w-5 text-magenta" />
                <div>
                  <p className="text-sm text-ink">{prochainAppel.titre}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {format(prochainAppel.date, "EEEE d MMMM · HH:mm", { locale: fr })} · {prochainAppel.dureeMin} min
                  </p>
                  {prochainAppel.lienVisio && (
                    <a href={prochainAppel.lienVisio} target="_blank" className="mt-2 inline-block text-xs text-magenta hover:underline">
                      Rejoindre la visio
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
