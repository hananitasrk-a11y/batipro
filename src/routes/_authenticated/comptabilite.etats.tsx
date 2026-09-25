import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Line = { numero: string; libelle: string; solde?: number; montant?: number };
type Bilan = { actif: Line[]; passif: Line[]; total_actif: number; total_passif: number };
type CR = { charges: Line[]; produits: Line[]; total_charges: number; total_produits: number; resultat: number };
type TVA = { tva_recuperable: number; tva_facturee: number; tva_a_payer: number };

function Page() {
  const [debut, setDebut] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [fin, setFin] = useState(new Date().toISOString().slice(0, 10));
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [cr, setCr] = useState<CR | null>(null);
  const [tva, setTva] = useState<TVA | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const [b, r, t] = await Promise.all([
      supabase.rpc("bilan", { p_date: fin }),
      supabase.rpc("compte_resultat", { p_date_debut: debut, p_date_fin: fin }),
      supabase.rpc("declaration_tva", { p_date_debut: debut, p_date_fin: fin }),
    ]);
    if (b.error || r.error || t.error) toast.error("Erreur"); 
    else { setBilan(b.data as Bilan); setCr(r.data as CR); setTva(t.data as TVA); }
    setLoading(false);
  };

  const fmt = (n: number) => (Number(n) || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-semibold">États financiers</h1><p className="text-muted-foreground">Bilan, compte de résultat et TVA</p></div>
      <Card>
        <CardContent className="pt-6 grid grid-cols-4 gap-3 items-end">
          <div><Label>Du</Label><Input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} /></div>
          <div><Label>Au</Label><Input type="date" value={fin} onChange={(e) => setFin(e.target.value)} /></div>
          <Button onClick={run} disabled={loading}>Générer</Button>
        </CardContent>
      </Card>

      {tva && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardHeader><CardTitle className="text-sm">TVA récupérable</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{fmt(tva.tva_recuperable)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">TVA facturée</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{fmt(tva.tva_facturee)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">TVA à payer</CardTitle></CardHeader><CardContent className="text-2xl font-semibold text-primary">{fmt(tva.tva_a_payer)}</CardContent></Card>
        </div>
      )}

      {cr && (
        <Card>
          <CardHeader><CardTitle>Compte de résultat</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Charges</h3>
              <Table><TableBody>{cr.charges.map((l) => (<TableRow key={l.numero}><TableCell className="font-mono">{l.numero}</TableCell><TableCell>{l.libelle}</TableCell><TableCell className="text-right">{fmt(l.montant!)}</TableCell></TableRow>))}
                <TableRow className="bg-muted/50 font-semibold"><TableCell colSpan={2}>Total charges</TableCell><TableCell className="text-right">{fmt(cr.total_charges)}</TableCell></TableRow>
              </TableBody></Table>
            </div>
            <div>
              <h3 className="font-medium mb-2">Produits</h3>
              <Table><TableBody>{cr.produits.map((l) => (<TableRow key={l.numero}><TableCell className="font-mono">{l.numero}</TableCell><TableCell>{l.libelle}</TableCell><TableCell className="text-right">{fmt(l.montant!)}</TableCell></TableRow>))}
                <TableRow className="bg-muted/50 font-semibold"><TableCell colSpan={2}>Total produits</TableCell><TableCell className="text-right">{fmt(cr.total_produits)}</TableCell></TableRow>
              </TableBody></Table>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <div className={`text-lg font-semibold ${cr.resultat >= 0 ? "text-primary" : "text-destructive"}`}>Résultat net : {fmt(cr.resultat)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {bilan && (
        <Card>
          <CardHeader><CardTitle>Bilan au {fin}</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Actif</h3>
              <Table><TableBody>{bilan.actif.map((l) => (<TableRow key={l.numero}><TableCell className="font-mono">{l.numero}</TableCell><TableCell>{l.libelle}</TableCell><TableCell className="text-right">{fmt(l.solde!)}</TableCell></TableRow>))}
                <TableRow className="bg-muted/50 font-semibold"><TableCell colSpan={2}>Total actif</TableCell><TableCell className="text-right">{fmt(bilan.total_actif)}</TableCell></TableRow>
              </TableBody></Table>
            </div>
            <div>
              <h3 className="font-medium mb-2">Passif</h3>
              <Table><TableBody>{bilan.passif.map((l) => (<TableRow key={l.numero}><TableCell className="font-mono">{l.numero}</TableCell><TableCell>{l.libelle}</TableCell><TableCell className="text-right">{fmt(l.solde!)}</TableCell></TableRow>))}
                <TableRow className="bg-muted/50 font-semibold"><TableCell colSpan={2}>Total passif</TableCell><TableCell className="text-right">{fmt(bilan.total_passif)}</TableCell></TableRow>
              </TableBody></Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/etats")({ component: Page });
