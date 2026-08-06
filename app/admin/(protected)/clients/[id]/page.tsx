import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, PhoneCall, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OfferBadge, InvoiceStatusBadge } from "@/components/shared/badges";
import { Stepper } from "@/components/shared/stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageStatusSelect } from "@/components/admin/stage-status-select";
import { ClientEditorialCalendar } from "@/components/admin/client-editorial-calendar";
import { UploadFileForm as UploadDocumentForm } from "@/components/shared/upload-file-form";
import { AddCallForm } from "@/components/admin/add-call-form";
import { AddInvoiceForm } from "@/components/admin/add-invoice-form";
import { uploadDocumentAction, deleteDocumentAction } from "@/lib/actions/documents";
import { createInvoiceAction } from "@/lib/actions/invoices";
import { createCallAction, deleteCallAction } from "@/lib/actions/calls";

const STAGE_ORDER = ["onboarding", "strategie", "calendrier", "resultats"] as const;

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: { stages: true },
  });
  if (!client) notFound();

  const [questions, answers, documents, invoices, posts, calls] = await Promise.all([
    prisma.onboardingQuestion.findMany({ orderBy: { ordre: "asc" } }),
    prisma.onboardingAnswer.findMany({ where: { clientId: id } }),
    prisma.document.findMany({ where: { clientId: id }, orderBy: { deposeLe: "desc" } }),
    prisma.invoice.findMany({ where: { clientId: id }, orderBy: { echeance: "desc" } }),
    prisma.editorialPost.findMany({ where: { clientId: id }, orderBy: { datePlanifiee: "asc" } }),
    prisma.call.findMany({ where: { clientId: id }, orderBy: { date: "desc" } }),
  ]);

  const stages = STAGE_ORDER.map(
    (etape) => client.stages.find((s) => s.etape === etape) ?? { etape, statut: "a_faire" as const }
  );
  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.reponse]));
  const onboardingStage = stages.find((s) => s.etape === "onboarding")!;
  const strategieDocs = documents.filter((d) => d.type === "strategie");
  const resultatsDocs = documents.filter((d) => d.type === "resultats");
  const contrats = documents.filter((d) => d.type === "contrat");
  const factures = invoices;

  return (
    <div className="space-y-6 p-8">
      <div>
        <Link href="/admin/clients" className="text-xs text-muted-foreground hover:text-ink">
          ← Tous les clients
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-ink">{client.nom}</h1>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
          <OfferBadge offre={client.offre} />
        </div>
        <div className="mt-6 max-w-2xl">
          <Stepper stages={stages} />
        </div>
      </div>

      <Tabs defaultValue="collaboration">
        <TabsList>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="administratif">Administratif</TabsTrigger>
          <TabsTrigger value="appels">Appels</TabsTrigger>
        </TabsList>

        <TabsContent value="collaboration" className="mt-6 space-y-5">
          {/* Onboarding */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">1. Onboarding</h3>
              <span className="font-mono text-[11px] uppercase text-muted-foreground">
                {onboardingStage.statut === "complete"
                  ? "Soumis"
                  : onboardingStage.statut === "en_cours"
                    ? "Brouillon en cours"
                    : "En attente"}
              </span>
            </div>
            {answers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Le client n&apos;a pas encore répondu au questionnaire.</p>
            ) : (
              <dl className="space-y-3">
                {questions.map((q) => {
                  const reponse = answerByQuestion.get(q.id);
                  if (reponse === undefined) return null;
                  return (
                    <div key={q.id}>
                      <dt className="text-xs text-muted-foreground">{q.texte}</dt>
                      <dd className="text-sm text-ink">{reponse || "—"}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </section>

          {/* Stratégie */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">2. Stratégie</h3>
              <StageStatusSelect clientId={client.id} etape="strategie" statut={stages[1].statut} />
            </div>
            <DocumentList documents={strategieDocs} clientId={client.id} />
            <div className="mt-3">
              <UploadDocumentForm action={uploadDocumentAction.bind(null, client.id, "strategie")} />
            </div>
          </section>

          {/* Calendrier */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">3. Calendrier éditorial</h3>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/calendrier?client=${client.id}`}
                  className="text-xs text-magenta hover:underline"
                >
                  Voir le calendrier complet →
                </Link>
                <StageStatusSelect clientId={client.id} etape="calendrier" statut={stages[2].statut} />
              </div>
            </div>
            <ClientEditorialCalendar clientId={client.id} posts={posts} />
          </section>

          {/* Résultats */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">4. Résultats</h3>
              <StageStatusSelect clientId={client.id} etape="resultats" statut={stages[3].statut} />
            </div>
            <DocumentList documents={resultatsDocs} clientId={client.id} />
            <div className="mt-3">
              <UploadDocumentForm action={uploadDocumentAction.bind(null, client.id, "resultats")} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="administratif" className="mt-6 space-y-6">
          <section className="space-y-3">
            <h3 className="font-serif text-lg text-ink">Factures</h3>
            <AddInvoiceForm action={createInvoiceAction.bind(null, client.id)} />
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              {factures.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Aucune facture.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {factures.map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-3 font-mono text-xs text-muted-foreground">
                          {format(inv.echeance, "d MMM yyyy", { locale: fr })}
                        </td>
                        <td className="p-3 text-ink">{inv.montant.toLocaleString("fr-FR")} €</td>
                        <td className="p-3">
                          <InvoiceStatusBadge statut={inv.statut} />
                        </td>
                        <td className="p-3 text-right">
                          {inv.url && (
                            <a href={inv.url} className="text-xs text-magenta hover:underline">
                              Télécharger
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg text-ink">Contrats</h3>
            <DocumentList documents={contrats} clientId={client.id} />
            <UploadDocumentForm action={uploadDocumentAction.bind(null, client.id, "contrat")} />
          </section>
        </TabsContent>

        <TabsContent value="appels" className="mt-6 space-y-4">
          <AddCallForm action={createCallAction.bind(null, client.id)} />
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            {calls.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Aucun appel programmé.</p>
            ) : (
              <ul className="divide-y divide-border">
                {calls.map((call) => (
                  <li key={call.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-ink">{call.titre}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {format(call.date, "EEEE d MMMM · HH:mm", { locale: fr })} · {call.dureeMin} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {call.lienVisio && (
                        <a href={call.lienVisio} target="_blank" className="text-xs text-magenta hover:underline">
                          Lien visio
                        </a>
                      )}
                      <form action={deleteCallAction.bind(null, call.id, client.id)}>
                        <button type="submit" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentList({
  documents,
  clientId,
}: {
  documents: { id: string; nomFichier: string; url: string; deposeLe: Date }[];
  clientId: string;
}) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun document déposé.</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between gap-3 py-2 text-sm">
          <a href={doc.url} className="flex items-center gap-2 text-ink hover:text-magenta">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            {doc.nomFichier}
          </a>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {format(doc.deposeLe, "d MMM yyyy", { locale: fr })}
            </span>
            <form action={deleteDocumentAction.bind(null, doc.id, clientId)}>
              <button type="submit" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
