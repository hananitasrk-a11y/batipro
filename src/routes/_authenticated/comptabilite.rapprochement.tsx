import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Link2, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/error-message";

type Rel = { id: string; compte_id: string; reference: string; date_debut: string; date_fin: string; solde_initial: number; solde_final: number; statut: string };
type LR = { id: string; date_operation: string; libelle: string; reference: string | null; debit: number; credit: number; rapproche: boolean; ligne_ecriture_id: string | null };
type C = { id: string; numero: string; libelle: string };
type LE = { id: string; libelle: string | null; debit: number; credit: number; ecriture: { numero: string; date_ecriture: string; libelle: string } | null };

function Page() {
  const [comptes, setComptes] = useState<C[]>([]);
  const [releves, setReleves] = useState<Rel[]>([]);
  const [selectedRelId, setSelectedRelId] = useState<string>("");
  const [lignes, setLignes] = useState<LR[]>([]);
  const [openRel, setOpenRel] = useState(false);
  const [openLigne, setOpenLigne] = useState(false);
  const [matchOpen, setMatchOpen] = useState<LR | null>(null);
  const [ecrLignes, setEcrLignes] = useState<LE[]>([]);
  const [saving, setSaving] = useState(false);

  const [newRel, setNewRel] = useState({ compte_id: "", reference: "", date_debut: "", date_fin: "", solde_initial: 0, solde_final: 0 });
  const [newLigne, setNewLigne] = useState({ date_operation: new Date().toISOString().slice(0, 10), libelle: "", reference: "", debit: 0, credit: 0 });

  const loadReleves = async () => {
    const { data } = await supabase.from("releves_bancaires").select("*").order("date_debut", { ascending: false });
    setReleves((data as Rel[]) ?? []);
  };
  const loadLignes = async (relId: string) => {
    const { data } = await supabase.from("lignes_releve").select("*").eq("releve_id", relId).order("date_operation");
    setLignes((data as LR[]) ?? []);
  };

  useEffect(() => {
    supabase.from("comptes_comptables").select("id,numero,libelle").in("classe", [5]).order("numero").then((r) => setComptes((r.data as C[]) ?? []));
    loadReleves();
  }, []);
  useEffect(() => { if (selectedRelId) loadLignes(selectedRelId); else setLignes([]); }, [selectedRelId]);

  const createRel = async () => {
    if (!newRel.compte_id || !newRel.reference || !newRel.date_debut || !newRel.date_fin) {
      toast.error("Compte, référence et période requis");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("releves_bancaires").insert(newRel);
      if (error) throw error;
      toast.success("Relevé créé");
      setOpenRel(false);
      await loadReleves();
    } catch (error) {
      toast.error(getErrorMessage(error, "Impossible de créer le relevé"));
    } finally {
      setSaving(false);
    }
  };
  const addLigne = async () => {
    if (!selectedRelId || !newLigne.date_operation || !newLigne.libelle) {
      toast.error("Relevé, date et libellé requis");
      return;
    }
    if (Number(newLigne.debit) > 0 && Number(newLigne.credit) > 0) {
      toast.error("Une ligne ne peut pas avoir un débit et un crédit simultanément");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("lignes_releve").insert({ ...newLigne, releve_id: selectedRelId });
      if (error) throw error;
      setOpenLigne(false);
      setNewLigne({ date_operation: new Date().toISOString().slice(0, 10), libelle: "", reference: "", debit: 0, credit: 0 });
      await loadLignes(selectedRelId);
      toast.success("Ligne ajoutée");
    } catch (error) {
      toast.error(getErrorMessage(error, "Impossible d'ajouter la ligne"));
    } finally {
      setSaving(false);
    }
  };
  const removeLigne = async (id: string) => {
    const { error } = await supabase.from("lignes_releve").delete().eq("id", id);
    if (error) {
      toast.error(getErrorMessage(error, "Impossible de supprimer la ligne"));
      return;
    }
    if (selectedRelId) await loadLignes(selectedRelId);
    toast.success("Ligne supprimée");
  };

  const openMatch = async (l: LR) => {
    setMatchOpen(l);
    const rel = releves.find((r) => r.id === selectedRelId);
    if (!rel) return;
    const { data } = await supabase
      .from("lignes_ecriture")
      .select("id,libelle,debit,credit,ecriture:ecritures(numero,date_ecriture,libelle)")
      .eq("compte_id", rel.compte_id)
      .order("id", { ascending: false })
      .limit(200);
    setEcrLignes((data as unknown as LE[]) ?? []);
  };
  const doMatch = async (ecrLigneId: string) => {
    if (!matchOpen) return;
    const { error } = await supabase.from("lignes_releve").update({ ligne_ecriture_id: ecrLigneId, rapproche: true }).eq("id", matchOpen.id);
    if (error) toast.error(error.message); else { setMatchOpen(null); if (selectedRelId) loadLignes(selectedRelId); toast.success("Rapproché"); }
  };
  const unmatch = async (id: string) => {
    const { error } = await supabase.from("lignes_releve").update({ ligne_ecriture_id: null, rapproche: false }).eq("id", id);
    if (error) {
      toast.error(getErrorMessage(error, "Impossible d'annuler le rapprochement"));
      return;
    }
    if (selectedRelId) await loadLignes(selectedRelId);
    toast.success("Rapprochement annulé");
  };

  const rel = releves.find((r) => r.id === selectedRelId);
  const totalD = lignes.reduce((s, l) => s + Number(l.debit || 0), 0);
  const totalC = lignes.reduce((s, l) => s + Number(l.credit || 0), 0);
  const rapproches = lignes.filter((l) => l.rapproche).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Rapprochement bancaire</h1><p className="text-muted-foreground">Relevés vs écritures comptables</p></div>
        <Dialog open={openRel} onOpenChange={setOpenRel}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouveau relevé</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau relevé bancaire</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Compte bancaire</Label>
                <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={newRel.compte_id} onChange={(e) => setNewRel({ ...newRel, compte_id: e.target.value })}>
                  <option value="">—</option>
                  {comptes.map((c) => <option key={c.id} value={c.id}>{c.numero} — {c.libelle}</option>)}
                </select>
              </div>
              <div><Label>Référence</Label><Input value={newRel.reference} onChange={(e) => setNewRel({ ...newRel, reference: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Du</Label><Input type="date" value={newRel.date_debut} onChange={(e) => setNewRel({ ...newRel, date_debut: e.target.value })} /></div>
                <div><Label>Au</Label><Input type="date" value={newRel.date_fin} onChange={(e) => setNewRel({ ...newRel, date_fin: e.target.value })} /></div>
                <div><Label>Solde initial</Label><Input type="number" step="0.01" value={newRel.solde_initial} onChange={(e) => setNewRel({ ...newRel, solde_initial: Number(e.target.value) })} /></div>
                <div><Label>Solde final</Label><Input type="number" step="0.01" value={newRel.solde_final} onChange={(e) => setNewRel({ ...newRel, solde_final: Number(e.target.value) })} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createRel} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Label>Relevé</Label>
          <select className="mt-1 w-full h-10 rounded-md border bg-background px-3 text-sm" value={selectedRelId} onChange={(e) => setSelectedRelId(e.target.value)}>
            <option value="">— Sélectionner un relevé —</option>
            {releves.map((r) => {
              const c = comptes.find((x) => x.id === r.compte_id);
              return <option key={r.id} value={r.id}>{r.reference} — {c?.numero} ({r.date_debut} → {r.date_fin})</option>;
            })}
          </select>
        </CardContent>
      </Card>

      {rel && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardHeader><CardTitle className="text-sm">Solde initial</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{Number(rel.solde_initial).toFixed(2)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Solde final</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{Number(rel.solde_final).toFixed(2)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Écart D/C</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{(totalC - totalD).toFixed(2)}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Rapprochées</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{rapproches} / {lignes.length}</CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Lignes du relevé</CardTitle>
              <Dialog open={openLigne} onOpenChange={setOpenLigne}>
                <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="mr-1 h-3 w-3" />Ajouter</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nouvelle ligne</DialogTitle></DialogHeader>
                  <div className="grid gap-3">
                    <div><Label>Date</Label><Input type="date" value={newLigne.date_operation} onChange={(e) => setNewLigne({ ...newLigne, date_operation: e.target.value })} /></div>
                    <div><Label>Libellé</Label><Input value={newLigne.libelle} onChange={(e) => setNewLigne({ ...newLigne, libelle: e.target.value })} /></div>
                    <div><Label>Référence</Label><Input value={newLigne.reference} onChange={(e) => setNewLigne({ ...newLigne, reference: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Débit</Label><Input type="number" step="0.01" value={newLigne.debit} onChange={(e) => setNewLigne({ ...newLigne, debit: Number(e.target.value) })} /></div>
                      <div><Label>Crédit</Label><Input type="number" step="0.01" value={newLigne.credit} onChange={(e) => setNewLigne({ ...newLigne, credit: Number(e.target.value) })} /></div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addLigne} disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Ajouter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Libellé</TableHead><TableHead>Réf</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead>Statut</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {lignes.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.date_operation}</TableCell>
                      <TableCell>{l.libelle}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.reference}</TableCell>
                      <TableCell className="text-right">{Number(l.debit).toFixed(2)}</TableCell>
                      <TableCell className="text-right">{Number(l.credit).toFixed(2)}</TableCell>
                      <TableCell>{l.rapproche ? <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" />Rapprochée</Badge> : <Badge variant="secondary">À rapprocher</Badge>}</TableCell>
                      <TableCell className="flex gap-1">
                        {l.rapproche ? <Button size="icon" variant="ghost" onClick={() => unmatch(l.id)}><Link2 className="h-4 w-4" /></Button>
                          : <Button size="icon" variant="ghost" onClick={() => openMatch(l)}><Link2 className="h-4 w-4" /></Button>}
                        <Button size="icon" variant="ghost" onClick={() => removeLigne(l.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {lignes.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune ligne</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={!!matchOpen} onOpenChange={(v) => !v && setMatchOpen(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Rapprocher : {matchOpen?.libelle}</DialogTitle></DialogHeader>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>N°</TableHead><TableHead>Libellé</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {ecrLignes.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.ecriture?.date_ecriture}</TableCell>
                    <TableCell className="font-mono text-xs">{e.ecriture?.numero}</TableCell>
                    <TableCell>{e.libelle || e.ecriture?.libelle}</TableCell>
                    <TableCell className="text-right">{Number(e.debit).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{Number(e.credit).toFixed(2)}</TableCell>
                    <TableCell><Button size="sm" onClick={() => doMatch(e.id)}>Lier</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/rapprochement")({ component: Page });
