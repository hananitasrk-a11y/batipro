import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/donnees/utilisateurs")({
  component: UtilisateursPage,
});

const ROLES: { value: string; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "direction", label: "Direction" },
  { value: "chef_chantier", label: "Chef chantier" },
  { value: "rh", label: "RH" },
  { value: "comptable", label: "Comptable" },
  { value: "magasinier", label: "Magasinier" },
  { value: "caissier", label: "Caissier" },
];

type Row = { id: string; full_name: string | null; job_title: string | null; phone: string | null; roles: string[] };

function UtilisateursPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, job_title, phone");
    const { data: rolesData } = await supabase.from("user_roles").select("user_id, role");
    const map = new Map<string, string[]>();
    (rolesData ?? []).forEach((r) => {
      const arr = map.get(r.user_id) ?? [];
      arr.push(r.role);
      map.set(r.user_id, arr);
    });
    setRows((profiles ?? []).map((p) => ({ ...p, roles: map.get(p.id) ?? [] })));
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
        setIsAdmin(!!data);
      }
      await load();
    })();
  }, [load]);

  const toggle = async (userId: string, role: string, has: boolean) => {
    const key = `${userId}:${role}`;
    setBusy(key);
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as never);
      if (error) toast.error(error.message); else toast.success("Rôle retiré");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as never });
      if (error) toast.error(error.message); else toast.success("Rôle attribué");
    }
    await load();
    setBusy(null);
  };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-accent" />
          <div className="text-sm">
            <p className="font-medium">Gestion des rôles</p>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Cochez / décochez les rôles pour attribuer les droits d'accès. Un utilisateur sans rôle n'a aucun accès."
                : "Seul un administrateur peut modifier les rôles."}
            </p>
          </div>
        </div>
      </Card>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Fonction</TableHead>
              {ROLES.map((r) => <TableHead key={r.value} className="text-center text-xs">{r.label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={2 + ROLES.length} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={2 + ROLES.length} className="h-32 text-center text-muted-foreground">Aucun utilisateur</TableCell></TableRow>
            ) : rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.full_name ?? "—"}
                  {r.phone && <div className="text-xs text-muted-foreground">{r.phone}</div>}
                </TableCell>
                <TableCell className="text-muted-foreground">{r.job_title ?? "—"}</TableCell>
                {ROLES.map((role) => {
                  const has = r.roles.includes(role.value);
                  const key = `${r.id}:${role.value}`;
                  return (
                    <TableCell key={role.value} className="text-center">
                      <Checkbox
                        checked={has}
                        disabled={!isAdmin || busy === key}
                        onCheckedChange={() => toggle(r.id, role.value, has)}
                        aria-label={`${role.label} pour ${r.full_name ?? r.id}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
