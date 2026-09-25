import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Search, Users, ShoppingCart, Building2, Package, Truck, UserCog, FileText, Receipt, ClipboardList,
} from "lucide-react";

type Src = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  table: string;
  fields: string[];
  labelField: string;
  subField?: string;
  route: string; // list route
};

const sources: Src[] = [
  { key: "clients",     label: "Clients",       icon: Users,         table: "clients",       fields: ["raison_sociale", "ice", "email", "telephone"], labelField: "raison_sociale", subField: "ice",  route: "/donnees/clients" },
  { key: "fournisseurs",label: "Fournisseurs",  icon: ShoppingCart,  table: "fournisseurs",  fields: ["raison_sociale", "ice", "email", "telephone"], labelField: "raison_sociale", subField: "ice",  route: "/donnees/fournisseurs" },
  { key: "chantiers",   label: "Chantiers",     icon: Building2,     table: "chantier",      fields: ["nom", "code", "adresse"], labelField: "nom", subField: "code", route: "/production" },
  { key: "produits",    label: "Produits",      icon: Package,       table: "produits_finis",fields: ["designation", "reference"], labelField: "designation", subField: "reference", route: "/donnees/produits" },
  { key: "engins",      label: "Engins",        icon: Truck,         table: "engins",        fields: ["designation", "matricule"], labelField: "designation", subField: "matricule", route: "/materiel" },
  { key: "employes",    label: "Employés",      icon: UserCog,       table: "employes",      fields: ["nom", "prenom", "cin", "matricule"], labelField: "nom", subField: "prenom", route: "/personnel" },
  { key: "factures",    label: "Factures",      icon: Receipt,       table: "factures",      fields: ["numero"], labelField: "numero", subField: "statut", route: "/ventes/factures" },
  { key: "devis",       label: "Devis",         icon: FileText,      table: "devis",         fields: ["numero"], labelField: "numero", subField: "statut", route: "/ventes/devis" },
  { key: "bc",          label: "Bons commande", icon: ClipboardList, table: "bons_commande", fields: ["numero"], labelField: "numero", subField: "statut", route: "/achats" },
];

type Hit = { source: Src; id: string; label: string; sub?: string };

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const seq = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setHits([]); return; }
    const my = ++seq.current;
    setLoading(true);
    const t = setTimeout(async () => {
      const results = await Promise.all(sources.map(async (s) => {
        const or = s.fields.map((f) => `${f}.ilike.%${term}%`).join(",");
        const select = Array.from(new Set(["id", s.labelField, ...(s.subField ? [s.subField] : [])])).join(",");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any).from(s.table).select(select).or(or).limit(5);
        return (data as Record<string, unknown>[] | null)?.map((r) => ({
          source: s,
          id: String(r.id),
          label: String(r[s.labelField] ?? "—"),
          sub: s.subField ? (r[s.subField] as string | undefined) ?? undefined : undefined,
        })) ?? [];
      }));
      if (my === seq.current) {
        setHits(results.flat());
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) {
      const arr = map.get(h.source.key) ?? [];
      arr.push(h);
      map.set(h.source.key, arr);
    }
    return Array.from(map.entries());
  }, [hits]);

  const go = (h: Hit) => {
    setOpen(false);
    navigate({ to: h.source.route });
  };

  return (
    <>
      <Button
        variant="outline" size="sm"
        onClick={() => setOpen(true)}
        className="h-9 w-64 justify-start gap-2 text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left text-sm">Rechercher…</span>
        <kbd className="pointer-events-none hidden select-none rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground md:inline">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher clients, factures, chantiers…" value={q} onValueChange={setQ} />
        <CommandList>
          {q.trim().length < 2 && <CommandEmpty>Tapez au moins 2 caractères.</CommandEmpty>}
          {q.trim().length >= 2 && !loading && hits.length === 0 && <CommandEmpty>Aucun résultat.</CommandEmpty>}
          {loading && <div className="p-3 text-xs text-muted-foreground">Recherche…</div>}
          {grouped.map(([key, items], i) => {
            const src = items[0].source;
            const Icon = src.icon;
            return (
              <div key={key}>
                {i > 0 && <CommandSeparator />}
                <CommandGroup heading={src.label}>
                  {items.map((h) => (
                    <CommandItem key={`${key}-${h.id}`} value={`${h.label} ${h.sub ?? ""} ${key}`} onSelect={() => go(h)}>
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{h.label}</span>
                      {h.sub && <span className="text-xs text-muted-foreground">{h.sub}</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
