import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, CheckCircle2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

type J = { id: string; code: string; libelle: string };
type C = { id: string; numero: string; libelle: string };
type Ecr = { id: string; numero: string; date_ecriture: string; journal_id: string; libelle: string; statut: string; total_debit: number; total_credit: number };
type Ligne = { id?: string; compte_id: string; libelle: string; debit: number; credit: number };

function Page() {
  const [journaux, setJournaux] = useState<J[]>([]);
  const [comptes, setComptes] = useState<C[]>([]);
  const [ecritures, setEcritures] = useState<Ecr[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ecr | null>(null);
  const [saving, setSaving] = useState(false);

  const [numero, setNumero] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [journalId, setJournalId] = useState("");
  const [libelle, setLibelle] = useState("");
  const [reference, setReference] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([
    { compte_id: "", libelle: "", debit: 0, credit: 0 },
    { compte_id: "", libelle: "", debit: 0, credit: 0 },
  ]);

  const totalDebit = useMemo(() => lignes.reduce((s, l) => s + Number(l.debit || 0), 0), [lignes]);
  const totalCredit = useMemo(() => lignes.reduce((s, l) => s + Number(l.credit || 0), 0), [lignes]);
  const equilibre = Math.abs(totalDebit - totalCredit) < 0.001 && totalDebit > 0;

  const load = async () => {
    setLoading(true);
    const [j, c, e] = await Promise.all([
      supabase.from("journaux").select("id,code,libelle").order("code"),
      supabase.from("comptes_comptables").select("id,numero,libelle").order("numero"),
      supabase.from("ecritures").select("*").order("date_ecriture", { ascending: false }).limit(200),
    ]);
    setJournaux((j.data as J[]) ?? []);
    setComptes((c.data as C[]) ?? []);
    setEcritures((e.data as Ecr[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null); setNumero(""); setDate(new Date().toISOString().slice(0, 10));
    setJournalId(""); setLibelle(""); setReference("");
    setLignes([{ compte_id: "", libelle: "", debit: 0, credit: 0 }, { compte_id: "", libelle: "", debit: 0, credit: 0 }]);
  };

  const openEdit = async (e: Ecr) => {
    setEditing(e); setNumero(e.numero); setDate(e.date_ecriture); setJournalId(e.journal_id); setLibelle(e.libelle);
    const { data } = await supabase.from("lignes_ecriture").select("id,compte_id,libelle,debit,credit").eq("ecriture_id", e.id);
    setLignes((data as Ligne[]) ?? []);
    setReference("");
    setOpen(true);
  };

  const save = async () => {
    if (!journalId || !libelle) { toast.error("Journal et libellé requis"); return; }
    if (!equilibre) { toast.error("L'écriture n'est pas équilibrée"); return; }
    if (lignes.some((l) => !l.compte_id)) { toast.error("Chaque ligne doit avoir un compte"); return; }
    setSaving(true);
    try {
      let ecrId = editing?.id;
      if (editing) {
        const { error } = await supabase.from("ecritures").update({ numero, date_ecriture: date, journal_id: journalId, libelle, reference }).eq("id", editing.id);
        if (error) throw error;
        const { error: deleteError } = await supabase.from("lignes_ecriture").delete().eq("ecriture_id", editing.id);
        if (deleteError) throw deleteError;
      } else {
        const num = numero || `ECR-${Date.now()}`;
        const { data, error } = await supabase.from("ecritures").insert({ numero: num, date_ecriture: date, journal_id: journalId, libelle, reference }).select("id").single();
        if (error) throw error;
        ecrId = data.id;
      }
      const payload = lignes.map((l) => ({ ecriture_id: ecrId!, compte_id: l.compte_id, libelle: l.libelle || null, debit: Number(l.debit || 0), credit: Number(l.credit || 0) }));
      const { error: e2 } = await supabase.from("lignes_ecriture").insert(payload);
      if (e2) throw e2;
      toast.success(editing ? "Écriture modifiée" : "Écriture créée");
      setOpen(false); reset(); await load();
    } catch (err) { toast.error(getErrorMessage(err, "Impossible d'enregistrer l'écriture")); }
    finally { setSaving(false); }
  };

  const valider = async (id: string) => {
    const { error } = await supabase.from("ecritures").update({ statut: "validee" }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Validée"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer cette écriture ?")) return;
    const { error } = await supabase.from("ecritures").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Écritures comptables</h1>
          <p className="text-muted-foreground">Saisie débit / crédit équilibrée</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouvelle écriture</Button></DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader><DialogTitle>{editing ? "Modifier l'écriture" : "Nouvelle écriture"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-4 gap-3">
              <div><Label>N°</Label><Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Auto" /></div>
              <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div>
                <Label>Journal</Label>
                <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={journalId} onChange={(e) => setJournalId(e.target.value)}>
                  <option value="">—</option>
                  {journaux.map((j) => <option key={j.id} value={j.id}>{j.code} — {j.libelle}</option>)}
                </select>
              </div>
              <div><Label>Référence</Label><Input value={reference} onChange={(e) => setReference(e.target.value)} /></div>
              <div className="col-span-4"><Label>Libellé</Label><Input value={libelle} onChange={(e) => setLibelle(e.target.value)} /></div>
            </div>
            <div className="mt-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-medium">Lignes</div>
                <Button size="sm" variant="outline" onClick={() => setLignes([...lignes, { compte_id: "", libelle: "", debit: 0, credit: 0 }])}><Plus className="mr-1 h-3 w-3" />Ajouter</Button>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Compte</TableHead><TableHead>Libellé</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {lignes.map((l, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={l.compte_id} onChange={(e) => setLignes(lignes.map((x, j) => j === i ? { ...x, compte_id: e.target.value } : x))}>
                          <option value="">—</option>
                          {comptes.map((c) => <option key={c.id} value={c.id}>{c.numero} — {c.libelle}</option>)}
                        </select>
                      </TableCell>
                      <TableCell><Input value={l.libelle} onChange={(e) => setLignes(lignes.map((x, j) => j === i ? { ...x, libelle: e.target.value } : x))} /></TableCell>
                      <TableCell><Input type="number" step="0.01" className="text-right" value={l.debit} onChange={(e) => setLignes(lignes.map((x, j) => j === i ? { ...x, debit: Number(e.target.value), credit: 0 } : x))} /></TableCell>
                      <TableCell><Input type="number" step="0.01" className="text-right" value={l.credit} onChange={(e) => setLignes(lignes.map((x, j) => j === i ? { ...x, credit: Number(e.target.value), debit: 0 } : x))} /></TableCell>
                      <TableCell><Button size="icon" variant="ghost" onClick={() => setLignes(lignes.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="text-right font-medium">Totaux</TableCell>
                    <TableCell className="text-right font-medium">{totalDebit.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">{totalCredit.toFixed(2)}</TableCell>
                    <TableCell>{equilibre ? <Badge variant="default">Équilibrée</Badge> : <Badge variant="destructive">Déséquilibre</Badge>}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={save} disabled={saving || !equilibre}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Dernières écritures</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="py-8 text-center text-muted-foreground">Chargement…</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Date</TableHead><TableHead>Journal</TableHead><TableHead>Libellé</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead>Statut</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {ecritures.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-sm">{e.numero}</TableCell>
                    <TableCell>{e.date_ecriture}</TableCell>
                    <TableCell>{journaux.find((j) => j.id === e.journal_id)?.code ?? "—"}</TableCell>
                    <TableCell>{e.libelle}</TableCell>
                    <TableCell className="text-right">{Number(e.total_debit).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{Number(e.total_credit).toFixed(2)}</TableCell>
                    <TableCell><Badge variant={e.statut === "validee" ? "default" : "secondary"}>{e.statut}</Badge></TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                      {e.statut === "brouillon" && <Button size="icon" variant="ghost" onClick={() => valider(e.id)}><CheckCircle2 className="h-4 w-4" /></Button>}
                      <Button size="icon" variant="ghost" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {ecritures.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucune écriture</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/ecritures")({ component: Page });
