import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/production/soustraitance-audit")({
  component: AuditPage,
});

type Chantier = { id: string; nom: string };
type SousTraitant = { id: string; raison_sociale: string };
type LogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string;
  details: any;
  created_at: string;
};

function AuditPage() {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [sousTraitants, setSousTraitants] = useState<SousTraitant[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<LogRow[]>([]);
  const [chantierId, setChantierId] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: st }, { data: p }] = await Promise.all([
        supabase.from("chantier").select("id,nom").order("nom"),
        supabase.from("sous_traitants").select("id,raison_sociale").order("raison_sociale"),
        supabase.from("profiles").select("id,full_name"),
      ]);
      setChantiers((c as Chantier[]) || []);
      setSousTraitants((st as SousTraitant[]) || []);
      const map: Record<string, string> = {};
      (p as any[] || []).forEach((r) => { map[r.id] = r.full_name || r.id; });
      setProfiles(map);
    })();
  }, []);

  async function load() {
    setLoading(true);
    let q = supabase
      .from("activity_log")
      .select("*")
      .in("entity", ["sous_traitants", "contrats_sous_traitance"])
      .order("created_at", { ascending: false })
      .limit(500);
    if (entityFilter) q = q.eq("entity", entityFilter);
    if (actionFilter) q = q.eq("action", actionFilter);
    const { data } = await q;
    let list = (data as LogRow[]) || [];
    if (chantierId) {
      list = list.filter((r) => {
        const d = r.details || {};
        const cid = d.chantier_id || d.after?.chantier_id || d.before?.chantier_id;
        return cid === chantierId;
      });
    }
    setRows(list);
    setLoading(false);
  }

  useEffect(() => { load(); }, [chantierId, entityFilter, actionFilter]);

  const chantierName = useMemo(() => {
    const m: Record<string, string> = {};
    chantiers.forEach((c) => (m[c.id] = c.nom));
    return m;
  }, [chantiers]);
  const stName = useMemo(() => {
    const m: Record<string, string> = {};
    sousTraitants.forEach((s) => (m[s.id] = s.raison_sociale));
    return m;
  }, [sousTraitants]);

  function rowChantier(r: LogRow): string {
    const d = r.details || {};
    const cid = d.chantier_id || d.after?.chantier_id || d.before?.chantier_id;
    return cid ? chantierName[cid] || cid : "—";
  }
  function rowSousTraitant(r: LogRow): string {
    const d = r.details || {};
    const sid = d.sous_traitant_id || d.after?.sous_traitant_id || d.before?.sous_traitant_id || (r.entity === "sous_traitants" ? d.id || d.after?.id : null);
    if (!sid) return "—";
    return stName[sid] || sid;
  }
  function actionBadge(a: string) {
    const map: Record<string, string> = { create: "bg-emerald-500/15 text-emerald-500", update: "bg-amber-500/15 text-amber-500", delete: "bg-red-500/15 text-red-500" };
    const label: Record<string, string> = { create: "Création", update: "Modification", delete: "Suppression" };
    return <Badge className={map[a] || ""} variant="outline">{label[a] || a}</Badge>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ScrollText className="w-6 h-6" /> Journal d'audit — Sous-traitance</h1>
          <p className="text-muted-foreground text-sm">Historique complet des créations, modifications et suppressions</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </Button>
      </div>

      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Chantier</label>
          <select className="w-full mt-1 h-9 rounded-md border bg-background px-3 text-sm" value={chantierId} onChange={(e) => setChantierId(e.target.value)}>
            <option value="">Tous</option>
            {chantiers.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Entité</label>
          <select className="w-full mt-1 h-9 rounded-md border bg-background px-3 text-sm" value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
            <option value="">Toutes</option>
            <option value="sous_traitants">Sous-traitants</option>
            <option value="contrats_sous_traitance">Contrats</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Action</label>
          <select className="w-full mt-1 h-9 rounded-md border bg-background px-3 text-sm" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="">Toutes</option>
            <option value="create">Création</option>
            <option value="update">Modification</option>
            <option value="delete">Suppression</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-3 py-2">Date / heure</th>
                <th className="px-3 py-2">Utilisateur</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Entité</th>
                <th className="px-3 py-2">Chantier</th>
                <th className="px-3 py-2">Sous-traitant</th>
                <th className="px-3 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Aucune entrée</td></tr>
              )}
              {rows.map((r) => (
                <>
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                    <td className="px-3 py-2">{r.user_id ? (profiles[r.user_id] || r.user_id.slice(0, 8)) : "—"}</td>
                    <td className="px-3 py-2">{actionBadge(r.action)}</td>
                    <td className="px-3 py-2">{r.entity === "sous_traitants" ? "Sous-traitant" : "Contrat"}</td>
                    <td className="px-3 py-2">{rowChantier(r)}</td>
                    <td className="px-3 py-2">{rowSousTraitant(r)}</td>
                    <td className="px-3 py-2">
                      <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                        {expanded === r.id ? "Masquer" : "Voir"}
                      </Button>
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="bg-muted/20">
                      <td colSpan={7} className="px-3 py-3">
                        <pre className="text-xs overflow-auto max-h-96 bg-background p-3 rounded border">{JSON.stringify(r.details, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
