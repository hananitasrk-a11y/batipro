import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  Building2, Users, ShoppingCart, Package, Layers, Warehouse, Settings, UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/donnees")({
  head: () => ({ meta: [{ title: "Référentiels — BatiPro" }] }),
  component: DonneesLayout,
});

const tabs = [
  { url: "/donnees", label: "Vue d'ensemble", icon: Layers, exact: true },
  { url: "/donnees/societe", label: "Société", icon: Building2 },
  { url: "/donnees/clients", label: "Clients", icon: Users },
  { url: "/donnees/fournisseurs", label: "Fournisseurs", icon: ShoppingCart },
  { url: "/donnees/produits", label: "Produits finis", icon: Package },
  { url: "/donnees/constituants", label: "Constituants", icon: Package },
  { url: "/donnees/depots", label: "Dépôts", icon: Warehouse },
  { url: "/donnees/parametres", label: "Paramètres", icon: Settings },
  { url: "/donnees/utilisateurs", label: "Utilisateurs", icon: UserCog },
];

function DonneesLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Référentiels</h1>
        <p className="text-sm text-muted-foreground">Base de données : société, tiers, produits, paramètres et utilisateurs.</p>
      </div>
      <Card className="p-1">
        <nav className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.url : pathname === t.url || pathname.startsWith(t.url + "/");
            return (
              <Link key={t.url} to={t.url} className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </Card>
      <Outlet />
    </div>
  );
}
