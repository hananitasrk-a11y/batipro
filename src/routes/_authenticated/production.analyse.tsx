import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalyticsView } from "@/components/analytics-view";
import { fmtMoney } from "@/lib/format";
import { TrendingUp, TrendingDown, Percent } from "lucide-react";

export const Route = createFileRoute("/_authenticated/production/analyse")({
  component: ProductionAnalyse,
});

type Fin = { id: string; nom: string; recettes: number; depenses: number; marge: number };

function ProductionAnalyse() {
  const [rows, setRows] = useState<Fin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("chantier_financials" as never);
      setRows(((data as unknown as Fin[]) ?? []).map((r) => ({
        ...r,
        recettes: Number(r.recettes),
        depenses: Number(r.depenses),
        marge: Number(r.marge),
      })));
      setLoading(false);
    })();
  }, []);

  const totRec = rows.reduce((s, r) => s + r.recettes, 0);
  const totDep = rows.reduce((s, r) => s + r.depenses, 0);
  const marge = totRec - totDep;
  const tauxMarge = totRec > 0 ? (marge / totRec) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recettes</div>
              <div className="mt-2 text-2xl font-bold text-success">{loading ? "…" : fmtMoney(totRec)}</div>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dépenses</div>
              <div className="mt-2 text-2xl font-bold text-destructive">{loading ? "…" : fmtMoney(totDep)}</div>
            </div>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Marge brute</div>
              <div className={`mt-2 text-2xl font-bold ${marge >= 0 ? "text-primary" : "text-destructive"}`}>{loading ? "…" : fmtMoney(marge)}</div>
            </div>
            <TrendingUp className={`h-5 w-5 ${marge >= 0 ? "text-primary" : "text-destructive"}`} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Taux de marge</div>
              <div className={`mt-2 text-2xl font-bold ${tauxMarge >= 0 ? "text-accent" : "text-destructive"}`}>{loading ? "…" : `${tauxMarge.toFixed(1)}%`}</div>
            </div>
            <Percent className="h-5 w-5 text-accent" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b p-4">
          <h2 className="font-semibold">Résultat par chantier</h2>
          <p className="text-xs text-muted-foreground">Recettes = factures TTC. Dépenses = constituants + gasoil + sous-traitance + locations.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chantier</TableHead>
              <TableHead className="text-right">Recettes</TableHead>
              <TableHead className="text-right">Dépenses</TableHead>
              <TableHead className="text-right">Marge</TableHead>
              <TableHead className="text-right">Taux</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Chargement…</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Aucun chantier</TableCell></TableRow>
            ) : rows.map((r) => {
              const t = r.recettes > 0 ? (r.marge / r.recettes) * 100 : 0;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nom}</TableCell>
                  <TableCell className="text-right">{fmtMoney(r.recettes)}</TableCell>
                  <TableCell className="text-right">{fmtMoney(r.depenses)}</TableCell>
                  <TableCell className={`text-right font-semibold ${r.marge >= 0 ? "text-primary" : "text-destructive"}`}>{fmtMoney(r.marge)}</TableCell>
                  <TableCell className={`text-right ${t >= 0 ? "text-muted-foreground" : "text-destructive"}`}>{r.recettes > 0 ? `${t.toFixed(1)}%` : "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <AnalyticsView
        title="Indicateurs d'activité"
        description="Volumétrie et répartition des chantiers"
        metrics={[
          { label: "Chantiers", table: "chantier" },
          { label: "Chantiers actifs", table: "chantier", filter: { statut: "en_cours" } },
          { label: "Phases", table: "phases_chantier" },
          { label: "Tâches ouvertes", table: "taches_chantier", filter: { statut: "en_cours" } },
        ]}
        charts={[
          { title: "Chantiers par statut", table: "chantier", groupBy: "statut", type: "pie" },
          { title: "Consommation par chantier (top 10)", table: "consommation_constituants", groupBy: "chantier_id", field: "cout_total", aggregate: "sum", labelMap: { table: "chantier", labelField: "nom" } },
          { title: "Rendement par chantier (top 10)", table: "rendement_journalier", groupBy: "chantier_id", field: "quantite_produite", aggregate: "sum", labelMap: { table: "chantier", labelField: "nom" } },
          { title: "Sous-traitance par chantier", table: "contrats_sous_traitance", groupBy: "chantier_id", field: "montant_ttc", aggregate: "sum", labelMap: { table: "chantier", labelField: "nom" } },
        ]}
      />
    </div>
  );
}
