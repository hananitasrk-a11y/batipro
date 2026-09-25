import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/donnees/log")({
  component: LogPage,
});

type Row = { id: string; user_id: string | null; action: string; entity: string | null; entity_id: string | null; details: unknown; created_at: string };

function LogPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500);
      setRows((data ?? []) as Row[]);
      const ids = Array.from(new Set((data ?? []).map((r) => r.user_id).filter(Boolean))) as string[];
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
        setNames(Object.fromEntries((profs ?? []).map((p) => [p.id, p.full_name ?? "—"])));
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Journal d'activité</h1>
        <p className="text-sm text-muted-foreground">500 derniers événements — réservé aux administrateurs et à la direction.</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entité</TableHead>
              <TableHead>Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Aucun événement enregistré</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("fr-FR")}</TableCell>
                <TableCell>{r.user_id ? (names[r.user_id] ?? r.user_id.slice(0, 8)) : "—"}</TableCell>
                <TableCell className="font-medium">{r.action}</TableCell>
                <TableCell>{r.entity ?? "—"}{r.entity_id ? <span className="text-muted-foreground"> · {r.entity_id.slice(0, 8)}</span> : null}</TableCell>
                <TableCell className="max-w-md truncate text-xs text-muted-foreground">{r.details ? JSON.stringify(r.details) : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
