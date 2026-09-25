import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrudTable } from "@/components/crud-table";
import { Card } from "@/components/ui/card";
import { fmtMoney } from "@/lib/format";
import { FileSignature, TrendingUp, Percent, Handshake } from "lucide-react";

export const Route = createFileRoute("/_authenticated/production/soustraitance")({
  component: SousTraitancePage,
});

type Chantier = { id: string; nom: string };
type Contrat = {
  id: string;
  chantier_id: string | null;
  sous_traitant_id: string | null;
  montant_ht: number | null;
  montant_ttc: number | null;
  avancement: number | null;
  statut: string | null;
};

function SousTraitancePage() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [chantierId, setChantierId] = useState<string>("");
  const [contrats, setContrats] = useState<Contrat[]>([]);

  useEffect(() => {
    void supabase.from("chantier").select("id, nom").order("nom").then(({ data }) => {
      setChantiers(((data as Chantier[]) ?? []));
    });
  }, []);

  useEffect(() => {
    let q = supabase.from("contrats_sous_traitance").select("id, chantier_id, sous_traitant_id, montant_ht, montant_ttc, avancement, statut");
    if (chantierId) q = q.eq("chantier_id", chantierId);
    void q.then(({ data }) => setContrats(((data as Contrat[]) ?? [])));
  }, [chantierId]);

  const kpis = useMemo(() => {
    const total = contrats.length;
    const actifs = contrats.filter((c) => c.statut === "en_cours").length;
    const ht = contrats.reduce((s, c) => s + Number(c.montant_ht ?? 0), 0);
    const ttc = contrats.reduce((s, c) => s + Number(c.montant_ttc ?? 0), 0);
    const av = total > 0 ? contrats.reduce((s, c) => s + Number(c.avancement ?? 0), 0) / total : 0;
    return { total, actifs, ht, ttc, av };
  }, [contrats]);

  const filter = chantierId ? { chantier_id: chantierId } : undefined;

  const chantierSelect = (
    <select
      className="rounded-md border bg-background px-3 py-2 text-sm"
      value={chantierId}
      onChange={(e) => setChantierId(e.target.value)}
    >
      <option value="">Tous les chantiers</option>
      {chantiers.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sous-traitance</h1>
        <p className="text-sm text-muted-foreground">Contrats et sous-traitants par chantier</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Contrats" value={String(kpis.total)} sub={`${kpis.actifs} en cours`} icon={FileSignature} />
        <Kpi label="Montant HT" value={fmtMoney(kpis.ht)} icon={TrendingUp} tone="primary" />
        <Kpi label="Montant TTC" value={fmtMoney(kpis.ttc)} icon={Handshake} tone="accent" />
        <Kpi label="Avancement moyen" value={`${kpis.av.toFixed(1)}%`} icon={Percent} tone="success" />
      </div>

      <Tabs defaultValue="contrats">
        <TabsList>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
          <TabsTrigger value="fournisseurs">Sous-traitants</TabsTrigger>
        </TabsList>
        <TabsContent value="contrats" className="mt-4">
          <CrudTable
            key={chantierId || "all"}
            title="Contrats de sous-traitance"
            description={chantierId ? "Contrats du chantier sélectionné" : "Tous les contrats"}
            table="contrats_sous_traitance"
            searchFields={["numero", "objet", "statut"]}
            filter={filter}
            toolbarExtra={chantierSelect}
            fields={[
              { name: "numero", label: "N°" },
              { name: "sous_traitant_id", label: "Sous-traitant", type: "select", required: true, ref: { table: "sous_traitants", labelField: "raison_sociale" } },
              { name: "chantier_id", label: "Chantier", type: "select", required: true, ref: { table: "chantier", labelField: "nom" } },
              { name: "phase_id", label: "Phase", type: "select", ref: { table: "phases_chantier", labelField: "nom" }, hideInTable: true },
              { name: "objet", label: "Objet", type: "text" },
              { name: "date_debut", label: "Début", type: "date" },
              { name: "date_fin", label: "Fin", type: "date" },
              { name: "montant_ht", label: "Montant HT", type: "number" },
              { name: "tva", label: "TVA", type: "number", hideInTable: true },
              { name: "montant_ttc", label: "Montant TTC", type: "number" },
              { name: "avancement", label: "Avancement (%)", type: "number" },
              { name: "statut", label: "Statut", type: "select", options: [
                { value: "en_cours", label: "En cours" },
                { value: "suspendu", label: "Suspendu" },
                { value: "termine", label: "Terminé" },
                { value: "annule", label: "Annulé" },
              ] },
              { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
            ]}
          />
        </TabsContent>
        <TabsContent value="fournisseurs" className="mt-4">
          <CrudTable
            title="Sous-traitants"
            description="Carnet des sous-traitants"
            table="sous_traitants"
            searchFields={["raison_sociale", "code", "specialite", "contact"]}
            fields={[
              { name: "code", label: "Code" },
              { name: "raison_sociale", label: "Raison sociale", required: true },
              { name: "specialite", label: "Spécialité" },
              { name: "contact", label: "Contact" },
              { name: "telephone", label: "Téléphone", type: "tel" },
              { name: "email", label: "Email", type: "email", hideInTable: true },
              { name: "adresse", label: "Adresse", type: "textarea", hideInTable: true },
              { name: "ice", label: "ICE", hideInTable: true },
              { name: "rib", label: "RIB", hideInTable: true },
              { name: "notes", label: "Notes", type: "textarea", hideInTable: true },
              { name: "actif", label: "Actif", type: "checkbox" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ label, value, sub, icon: Icon, tone = "muted" }: {
  label: string; value: string; sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "muted" | "primary" | "accent" | "success";
}) {
  const toneCls = tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : tone === "success" ? "text-success" : "text-foreground";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={`mt-2 text-2xl font-bold ${toneCls}`}>{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        <Icon className={`h-5 w-5 ${toneCls}`} />
      </div>
    </Card>
  );
}
