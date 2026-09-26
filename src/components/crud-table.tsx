import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-message";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "textarea" | "checkbox" | "date" | "select";
  required?: boolean;
  hideInTable?: boolean;
  defaultValue?: string | number | boolean | null;
  options?: { value: string; label: string }[];
  ref?: { table: string; labelField: string; valueField?: string; orderBy?: string };
}

export interface RowAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: Record<string, unknown> & { id: string }) => void | Promise<void>;
}

export interface BulkAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (rows: (Record<string, unknown> & { id: string })[]) => void | Promise<void>;
}

export interface CrudTableProps {
  title: string;
  description?: string;
  table: string;
  fields: FieldDef[];
  searchFields?: string[];
  orderBy?: string;
  rowActions?: RowAction[];
  bulkActions?: BulkAction[];
  filter?: Record<string, string | null | undefined>;
  toolbarExtra?: React.ReactNode;
}

type Row = Record<string, unknown> & { id: string };

const resolveTableName = (table: string) => table;

export function CrudTable({ title, description, table, fields, searchFields = [], orderBy = "created_at", rowActions = [], bulkActions = [], filter, toolbarExtra }: CrudTableProps) {
  const resolvedTable = resolveTableName(table);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [refOptions, setRefOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const refFields = useMemo(() => fields.filter((f) => f.ref), [fields]);

  const filterKey = filter ? JSON.stringify(filter) : "";

  const load = async () => {
    setLoading(true);
    try {
      const queryWithOrder = async (currentOrderBy: string) => {
        let q = supabase.from(resolvedTable as never).select("*");
        if (currentOrderBy) q = q.order(currentOrderBy, { ascending: false });
        if (filter) {
          for (const [k, v] of Object.entries(filter)) {
            if (v != null && v !== "") q = q.eq(k, v);
          }
        }
        return q;
      };

      let result = await queryWithOrder(orderBy);
      let { data, error } = await result;

      if (error && orderBy === "created_at") {
        result = await queryWithOrder("id");
        ({ data, error } = await result);
      }

      if (error) throw error;
      setRows((data as Row[]) ?? []);
      setSelected(new Set());
    } catch (error) {
      setRows([]);
      toast.error(getErrorMessage(error, `Impossible de charger ${table}`));
    } finally {
      setLoading(false);
    }
  };

  const loadRefs = async () => {
    const out: Record<string, { value: string; label: string }[]> = {};
    for (const f of refFields) {
      if (!f.ref) continue;
      const val = f.ref.valueField ?? "id";
      const { data, error } = await supabase
          .from(resolveTableName(f.ref.table) as never)
        .select(`${val}, ${f.ref.labelField}`)
        .order(f.ref.orderBy ?? f.ref.labelField, { ascending: true });
      if (error) { console.error(error); continue; }
      out[f.name] = ((data as Record<string, unknown>[]) ?? []).map((r) => ({
        value: String(r[val] ?? ""),
        label: String(r[f.ref!.labelField] ?? ""),
      }));
    }
    setRefOptions(out);
  };

  useEffect(() => { void load(); void loadRefs(); /* eslint-disable-next-line */ }, [table, filterKey]);

  const refLabel = (fieldName: string, value: unknown) => {
    const opts = refOptions[fieldName];
    if (!opts || value == null) return value == null ? "—" : String(value);
    const match = opts.find((o) => o.value === String(value));
    return match ? match.label : String(value);
  };

  const defaultsFromFilter = () => {
    const d: Record<string, unknown> = {};
    if (filter) for (const [k, v] of Object.entries(filter)) if (v) d[k] = v;
    for (const field of fields) {
      if (field.defaultValue != null && d[field.name] == null) d[field.name] = field.defaultValue;
    }
    return d;
  };
  const openNew = () => { setEditing(null); setForm(defaultsFromFilter()); setOpen(true); };
  const openEdit = (r: Row) => { setEditing(r); setForm({ ...r }); setOpen(true); };

  const save = async () => {
    const missing = fields
      .filter((f) => f.required && (form[f.name] == null || String(form[f.name]).trim() === ""))
      .map((f) => f.label);
    if (missing.length > 0) {
      toast.error(`Champs requis : ${missing.join(", ")}`);
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const v = form[f.name];
        if (f.type === "number") payload[f.name] = v === "" || v == null ? null : Number(v);
        else if (f.type === "checkbox") payload[f.name] = !!v;
        else if (v === "") payload[f.name] = null;
        else payload[f.name] = v ?? null;
      }
      const q = editing
        ? supabase.from(resolvedTable as never).update(payload as never).eq("id", editing.id)
        : supabase.from(resolvedTable as never).insert(payload as never);
      const { error } = await q;
      if (error) throw error;
      toast.success(editing ? "Modifié" : "Créé");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error, `Impossible d'enregistrer dans ${table}`));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Row) => {
    if (!confirm("Supprimer définitivement ?")) return;
    const { error } = await supabase.from(resolveTableName(table) as never).delete().eq("id", r.id);
    if (error) { toast.error(getErrorMessage(error, `Impossible de supprimer dans ${table}`)); return; }
    toast.success("Supprimé");
    void load();
  };

  const filtered = search && searchFields.length
    ? rows.filter((r) => searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(search.toLowerCase())))
    : rows;

  const tableFields = fields.filter((f) => !f.hideInTable);
  const showSelect = bulkActions.length > 0;
  const allSelected = showSelect && filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const someSelected = showSelect && filtered.some((r) => selected.has(r.id));

  const toggleAll = (checked: boolean) => {
    const next = new Set(selected);
    if (checked) filtered.forEach((r) => next.add(r.id));
    else filtered.forEach((r) => next.delete(r.id));
    setSelected(next);
  };
  const toggleOne = (id: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(id); else next.delete(id);
    setSelected(next);
  };

  const runBulk = async (a: BulkAction) => {
    const picked = rows.filter((r) => selected.has(r.id));
    if (picked.length === 0) { toast.error("Aucune ligne sélectionnée"); return; }
    setBulkBusy(true);
    try { await a.onClick(picked); }
    catch (e) { toast.error(getErrorMessage(e, `Impossible d'exécuter ${a.label.toLowerCase()}`)); }
    finally { setBulkBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbarExtra}
          {searchFields.length > 0 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="w-64 pl-8" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          )}
          <Button variant="outline" onClick={() => {
            const cols = tableFields.map((f) => f.name);
            const header = tableFields.map((f) => f.label);
            const esc = (v: unknown) => {
              const s = v == null ? "" : String(v);
              return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
            };
            const lines = [header.map(esc).join(";")];
            for (const r of filtered) {
              lines.push(cols.map((c) => {
                const f = tableFields.find((x) => x.name === c)!;
                const raw = f.ref ? refLabel(c, r[c])
                  : f.type === "select" && f.options ? (f.options.find((o) => o.value === String(r[c]))?.label ?? r[c])
                  : r[c];
                return esc(raw);
              }).join(";"));
            }
            const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `${table}-${new Date().toISOString().slice(0,10)}.csv`;
            a.click(); URL.revokeObjectURL(url);
          }}>
            <Download className="mr-1 h-4 w-4" /> Excel
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Nouveau</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? `Modifier — ${title}` : `Nouveau — ${title}`}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto">
                {fields.map((f) => {
                  const value = form[f.name];
                  const strVal = value == null ? "" : String(value);
                  return (
                    <div key={f.name}>
                      <Label htmlFor={f.name}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                      {f.type === "textarea" ? (
                        <textarea id={f.name} className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={3}
                          value={strVal} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                      ) : f.type === "checkbox" ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input id={f.name} type="checkbox" checked={!!value} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
                          <span className="text-sm text-muted-foreground">Activer</span>
                        </div>
                      ) : f.type === "select" || f.ref ? (
                        <select id={f.name} className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                          value={strVal} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                          <option value="">— Sélectionner —</option>
                          {(f.options ?? refOptions[f.name] ?? []).map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      ) : (
                        <Input id={f.name} type={f.type ?? "text"} required={f.required}
                          value={strVal}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                      )}
                    </div>
                  );
                })}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showSelect && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
          <div className="ml-auto flex gap-2">
            {bulkActions.map((a) => (
              <Button key={a.label} size="sm" variant="outline" disabled={bulkBusy} onClick={() => runBulk(a)}>
                {bulkBusy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : a.icon ? <a.icon className="mr-1 h-4 w-4" /> : null}
                {a.label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Désélectionner</Button>
          </div>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {showSelect && (
                <TableHead className="w-10">
                  <Checkbox checked={allSelected || (someSelected && "indeterminate")} onCheckedChange={(v) => toggleAll(!!v)} />
                </TableHead>
              )}
              {tableFields.map((f) => <TableHead key={f.name}>{f.label}</TableHead>)}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={tableFields.length + 1 + (showSelect ? 1 : 0)} className="h-32 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={tableFields.length + 1 + (showSelect ? 1 : 0)} className="h-32 text-center text-muted-foreground">Aucun enregistrement</TableCell></TableRow>
            ) : filtered.map((r) => (
              <TableRow key={r.id}>
                {showSelect && (
                  <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={(v) => toggleOne(r.id, !!v)} /></TableCell>
                )}
                {tableFields.map((f) => (
                  <TableCell key={f.name}>
                    {f.type === "checkbox"
                      ? (r[f.name] ? <span className="inline-flex rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Oui</span> : <span className="text-muted-foreground">Non</span>)
                      : f.ref
                        ? refLabel(f.name, r[f.name])
                        : f.type === "select" && f.options
                          ? (f.options.find((o) => o.value === String(r[f.name]))?.label ?? String(r[f.name] ?? "—"))
                          : String(r[f.name] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-right whitespace-nowrap">
                  {rowActions.map((a) => (
                    <Button key={a.label} variant="ghost" size="icon" title={a.label} onClick={() => a.onClick(r)}>
                      {a.icon ? <a.icon className="h-4 w-4" /> : a.label}
                    </Button>
                  ))}
                  <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
