import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type C = { id: string; numero: string; libelle: string };
type L = { date_ecriture: string; numero: string; ecr_libelle: string; libelle: string | null; debit: number; credit: number; solde: number };

function Page() {
  const [comptes, setComptes] = useState<C[]>([]);
  const [compteId, setCompteId] = useState("");
  const [debut, setDebut] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fin, setFin] = useState(new Date().toISOString().slice(0, 10));
  const [lignes, setLignes] = useState<L[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { supabase.from("comptes_comptables").select("id,numero,libelle").order("numero").then((r) => setComptes((r.data as C[]) ?? [])); }, []);

  const run = async () => {
    if (!compteId) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("grand_livre", { p_compte_id: compteId, p_date_debut: debut, p_date_fin: fin });
    if (error) toast.error(error.message); else setLignes((data as L[]) ?? []);
    setLoading(false);
  };

  const td = lignes.reduce((s, l) => s + Number(l.debit || 0), 0);
  const tc = lignes.reduce((s, l) => s + Number(l.credit || 0), 0);

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">Grand livre</h1><p className="text-muted-foreground">Mouvements détaillés d'un compte</p></div>
      <Card>
        <CardContent className="pt-6 grid grid-cols-4 gap-3 items-end">
          <div className="col-span-2">
            <Label>Compte</Label>
            <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={compteId} onChange={(e) => setCompteId(e.target.value)}>
              <option value="">— Sélectionner —</option>
              {comptes.map((c) => <option key={c.id} value={c.id}>{c.numero} — {c.libelle}</option>)}
            </select>
          </div>
          <div><Label>Du</Label><Input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></div>
          <div><Label>Au</Label><Input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></div>
          <Button className="col-span-4 sm:col-span-1" onClick={run} disabled={!compteId || loading}>Afficher</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Mouvements</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>N° écr.</TableHead><TableHead>Libellé</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead className="text-right">Solde</TableHead></TableRow></TableHeader>
            <TableBody>
              {lignes.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.date_ecriture}</TableCell>
                  <TableCell className="font-mono text-xs">{l.numero}</TableCell>
                  <TableCell>{l.libelle || l.ecr_libelle}</TableCell>
                  <TableCell className="text-right">{Number(l.debit).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{Number(l.credit).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">{Number(l.solde).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {lignes.length > 0 && (
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-semibold text-right">Totaux</TableCell>
                  <TableCell className="text-right font-semibold">{td.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">{tc.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">{(td - tc).toFixed(2)}</TableCell>
                </TableRow>
              )}
              {lignes.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Sélectionnez un compte et une période</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/grand-livre")({ component: Page });
