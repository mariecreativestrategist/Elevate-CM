import { startOfMonth } from "date-fns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { InvoiceStatusBadge } from "@/components/shared/badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminAdministratifPage() {
  const monthStart = startOfMonth(new Date());

  const [invoices, contrats, facturéCeMois, enAttente, enRetard] = await Promise.all([
    prisma.invoice.findMany({ include: { client: true }, orderBy: { echeance: "desc" } }),
    prisma.document.findMany({ where: { type: "contrat" }, include: { client: true }, orderBy: { deposeLe: "desc" } }),
    prisma.invoice.aggregate({ _sum: { montant: true }, where: { createdAt: { gte: monthStart } } }),
    prisma.invoice.aggregate({ _sum: { montant: true }, where: { statut: "en_attente" } }),
    prisma.invoice.aggregate({ _sum: { montant: true }, where: { statut: "en_retard" } }),
  ]);

  const fmt = (n: number | null) => `${(n ?? 0).toLocaleString("fr-FR")} €`;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Administratif</h1>
        <p className="text-sm text-muted-foreground">Vue transverse sur tous les clients.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Facturé ce mois" value={fmt(facturéCeMois._sum.montant)} accent="magenta" />
        <StatCard label="En attente" value={fmt(enAttente._sum.montant)} accent="butter" />
        <StatCard label="En retard" value={fmt(enRetard._sum.montant)} accent="corail" />
      </div>

      <Tabs defaultValue="factures">
        <TabsList>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
        </TabsList>

        <TabsContent value="factures" className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Échéance</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-3 text-ink">{inv.client.nom}</td>
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
                          Voir
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="contrats" className="mt-4">
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
            {contrats.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-ink">{doc.nomFichier}</p>
                    <p className="text-xs text-muted-foreground">{doc.client.nom}</p>
                  </div>
                </div>
                <a href={doc.url} className="text-xs text-magenta hover:underline">
                  Télécharger
                </a>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
