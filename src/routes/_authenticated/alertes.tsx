import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Wrench, Package, Loader2, Handshake } from "lucide-react";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/alertes")({
  head: () => ({ meta: [{ title: "Alertes — BatiPro" }] }),
  component: AlertesPage,
});

type Alert = { type: string; severity: "high" | "medium" | "low"; title: string; detail: string; url: string };

function AlertesPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date();
      const in30 = new Date(today.getTime() + 30 * 86400000).toISOString().slice(0, 10);
      const todayStr = today.toISOString().slice(0, 10);
      const out: Alert[] = [];

      // Papiers engins expirés/proches
      const { data: papiers } = await supabase
        .from("papiers_engins" as never).select("*").lte("date_expiration", in30);
      ((papiers as Record<string, unknown>[]) ?? []).forEach((p) => {
        const exp = String(p.date_expiration ?? "");
        const sev: Alert["severity"] = exp < todayStr ? "high" : "medium";
        out.push({
          type: "Papier engin", severity: sev,
          title: `Papier expir${exp < todayStr ? "é" : "e bientôt"} (${exp})`,
          detail: String(p.numero ?? p.type_papier ?? "—"),
          url: "/materiel/papiers",
        });
      });

      // Factures impayées en retard
      const { data: factures } = await supabase
        .from("factures" as never).select("*").lt("echeance", todayStr).neq("statut", "payee");
      ((factures as Record<string, unknown>[]) ?? []).forEach((f) => {
        out.push({
          type: "Facture impayée", severity: "high",
          title: `Facture ${f.numero ?? ""} en retard`,
          detail: `${fmtMoney(Number(f.montant_ttc ?? 0))} — échéance ${f.echeance}`,
          url: "/ventes/factures",
        });
      });

      // Engins en panne
      const { data: pannes } = await supabase
        .from("pannes_engins" as never).select("*").neq("statut", "resolu");
      ((pannes as Record<string, unknown>[]) ?? []).forEach((p) => {
        out.push({
          type: "Panne engin", severity: "medium",
          title: String(p.description ?? "Panne en cours"),
          detail: `Statut: ${p.statut ?? "—"}`,
          url: "/materiel/pannes",
        });
      });

      // Contrats sous-traitance — fin de validité proche / dépassée
      const { data: contrats } = await supabase
        .from("contrats_sous_traitance" as never)
        .select("id, numero, objet, date_fin, statut, chantier_id, sous_traitant_id, chantiers(nom), sous_traitants(raison_sociale)")
        .lte("date_fin", in30)
        .neq("statut", "termine")
        .neq("statut", "annule");
      ((contrats as Record<string, unknown>[]) ?? []).forEach((c) => {
        const fin = String(c.date_fin ?? "");
        if (!fin) return;
        const sev: Alert["severity"] = fin < todayStr ? "high" : "medium";
        const chantierNom = (c.chantiers as { nom?: string } | null)?.nom ?? "—";
        const stNom = (c.sous_traitants as { raison_sociale?: string } | null)?.raison_sociale ?? "—";
        out.push({
          type: "Contrat sous-traitance", severity: sev,
          title: fin < todayStr
            ? `Contrat ${c.numero ?? ""} expiré (${fin}) — renouvellement requis`
            : `Contrat ${c.numero ?? ""} arrive à échéance (${fin})`,
          detail: `Chantier: ${chantierNom} • Sous-traitant: ${stNom}${c.objet ? ` • ${c.objet}` : ""}`,
          url: "/production/soustraitance",
        });
      });

      // (Stock min/seuil non défini sur produits_finis — section désactivée)


      out.sort((a, b) => (a.severity === "high" ? -1 : b.severity === "high" ? 1 : 0));
      setAlerts(out);
      setLoading(false);
    })();
  }, []);

  const counts = {
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  };

  const iconFor = (t: string) =>
    t.includes("Facture") ? FileText : t.includes("Stock") ? Package : t.includes("Contrat") ? Handshake : Wrench;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Alertes</h1>
        <p className="text-sm text-muted-foreground">Centre des alertes : papiers, impayés, pannes, stock.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Critiques</div><div className="mt-1 text-2xl font-bold text-destructive">{counts.high}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">À surveiller</div><div className="mt-1 text-2xl font-bold text-warning">{counts.medium}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Info</div><div className="mt-1 text-2xl font-bold text-muted-foreground">{counts.low}</div></Card>
      </div>

      <Card className="divide-y">
        {loading ? (
          <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : alerts.length === 0 ? (
          <div className="grid h-40 place-items-center text-sm text-muted-foreground">Aucune alerte 🎉</div>
        ) : alerts.map((a, i) => {
          const Icon = iconFor(a.type);
          return (
            <Link key={i} to={a.url} className="flex items-start gap-3 p-4 transition hover:bg-muted/40">
              <div className={`mt-0.5 grid h-8 w-8 place-items-center rounded-md ${a.severity === "high" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{a.title}</span>
                  <Badge variant={a.severity === "high" ? "destructive" : "secondary"}>{a.type}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{a.detail}</div>
              </div>
              <AlertTriangle className={`h-4 w-4 shrink-0 ${a.severity === "high" ? "text-destructive" : "text-warning"}`} />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
