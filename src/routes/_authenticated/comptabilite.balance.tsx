import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type B = { numero: string; libelle: string; classe: number; type: string; total_debit: number; total_credit: number; solde: number };

function Page() {
  const [debut, setDebut] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fin, setFin] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState<B[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("balance_generale", { p_date_debut: debut, p_date_fin: fin });
    if (error) toast.error(error.message); else setRows((data as B[]) ?? []);
    setLoading(false);
  };

  const td = rows.reduce((s, r) => s + Number(r.total_debit || 0), 0);
  const tc = rows.reduce((s, r) => s + Number(r.total_credit || 0), 0);
  const sd = rows.filter((r) => r.solde > 0).reduce((s, r) => s + r.solde, 0);
  const sc = rows.filter((r) => r.solde < 0).reduce((s, r) => s + -r.solde, 0);

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">Balance générale</h1><p className="text-muted-foreground">Cumul des mouvements par compte</p></div>
      <Card>
        <CardContent className="pt-6 grid grid-cols-4 gap-3 items-end">
          <div><Label>Du</Label><Input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></div>
          <div><Label>Au</Label><Input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></div>
          <Button onClick={run} disabled={loading}>Générer</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Résultat</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Compte</TableHead><TableHead className="text-right">Débit</TableHead><TableHead className="text-right">Crédit</TableHead><TableHead className="text-right">Solde débiteur</TableHead><TableHead className="text-right">Solde créditeur</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.numero}>
                  <TableCell className="font-mono">{r.numero}</TableCell>
                  <TableCell>{r.libelle}</TableCell>
                  <TableCell className="text-right">{Number(r.total_debit).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{Number(r.total_credit).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{r.solde > 0 ? Number(r.solde).toFixed(2) : ""}</TableCell>
                  <TableCell className="text-right">{r.solde < 0 ? Number(-r.solde).toFixed(2) : ""}</TableCell>
                </TableRow>
              ))}
              {rows.length > 0 && (
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={2}>Totaux</TableCell>
                  <TableCell className="text-right">{td.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{tc.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{sd.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{sc.toFixed(2)}</TableCell>
                </TableRow>
              )}
              {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Cliquez sur Générer</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/balance")({ component: Page });
