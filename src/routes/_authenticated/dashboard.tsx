import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { HardHat, Users, Wrench, Wallet, TrendingUp, AlertTriangle, ShoppingCart, Package, FileText, Truck } from "lucide-react";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — BatiPro" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [k, setK] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timeout = new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("dashboard_kpis timeout")), 4000);
    });
    Promise.race([supabase.rpc("dashboard_kpis" as never), timeout])
      .then((result) => {
        if (!active) return;
        const { data, error } = result as { data: unknown; error: unknown };
        if (!error && data && typeof data === "object") setK(data as Record<string, number>);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const kpis = [
    { label: "Chantiers actifs", value: k.chantiersActifs ?? 0, icon: HardHat, color: "text-primary" },
    { label: "CA facturé", value: fmtMoney(k.caFacture ?? 0), icon: TrendingUp, color: "text-accent" },
    { label: "Encaissé", value: fmtMoney(k.encaisse ?? 0), icon: Wallet, color: "text-success" },
    { label: "Achats", value: fmtMoney(k.achats ?? 0), icon: ShoppingCart, color: "text-warning" },
  ];

  const refs = [
    { label: "Clients", value: k.clients ?? 0, icon: Users, to: "/donnees/clients" },
    { label: "Fournisseurs", value: k.fournisseurs ?? 0, icon: ShoppingCart, to: "/donnees/fournisseurs" },
    { label: "Produits", value: k.produits ?? 0, icon: Package, to: "/donnees/produits" },
    { label: "Dépôts", value: k.depots ?? 0, icon: Package, to: "/donnees/depots" },
    { label: "Employés", value: k.employes ?? 0, icon: Users, to: "/personnel" },
    { label: "Engins", value: k.engins ?? 0, icon: Wrench, to: "/materiel" },
    { label: "Véhicules", value: k.vehicules ?? 0, icon: Truck, to: "/transport" },
  ];

  const quick = [
    { label: "Nouveau chantier", to: "/production", icon: HardHat },
    { label: "Nouvelle facture", to: "/ventes/factures", icon: FileText },
    { label: "Nouvel achat", to: "/achats", icon: ShoppingCart },
    { label: "Pointage", to: "/personnel/pointage", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de l'activité</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
                <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>{loading ? "…" : kpi.value}</div>
              </div>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold">Référentiels</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {refs.map((r) => (
              <Link key={r.label} to={r.to} className="rounded-lg border bg-muted/30 p-3 transition hover:bg-muted/60">
                <r.icon className="h-4 w-4 text-muted-foreground" />
                <div className="mt-2 text-xl font-semibold">{r.value}</div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /><h2 className="font-semibold">Solde à recouvrer</h2></div>
          <div className="mt-4 text-3xl font-bold text-warning">{loading ? "…" : fmtMoney((k.caFacture ?? 0) - (k.encaisse ?? 0))}</div>
          <p className="mt-2 text-xs text-muted-foreground">Différence entre factures émises et règlements reçus.</p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-semibold">Raccourcis</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {quick.map((q) => (
            <Link key={q.label} to={q.to} className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm transition hover:bg-muted">
              <q.icon className="h-4 w-4 text-primary" /> {q.label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
