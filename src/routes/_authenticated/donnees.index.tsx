import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Building2, Users, ShoppingCart, Package, Warehouse, Settings, UserCog, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/donnees/")({
  component: DonneesIndex,
});

const sections = [
  { url: "/donnees/societe", title: "Société", desc: "Informations légales et fiscales de l'entreprise", icon: Building2 },
  { url: "/donnees/clients", title: "Clients", desc: "Carnet d'adresses clients", icon: Users },
  { url: "/donnees/fournisseurs", title: "Fournisseurs", desc: "Carnet fournisseurs et délais de paiement", icon: ShoppingCart },
  { url: "/donnees/produits", title: "Produits finis", desc: "Catalogue de produits vendus", icon: Package },
  { url: "/donnees/constituants", title: "Constituants", desc: "Matières premières et composants", icon: Package },
  { url: "/donnees/depots", title: "Dépôts", desc: "Entrepôts et lieux de stockage", icon: Warehouse },
  { url: "/donnees/parametres", title: "Paramètres", desc: "TVA, devises, unités, modes de règlement…", icon: Settings },
  { url: "/donnees/utilisateurs", title: "Utilisateurs", desc: "Comptes et rôles des collaborateurs", icon: UserCog },
];

function DonneesIndex() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((s) => (
        <Link key={s.url} to={s.url}>
          <Card className="group h-full p-5 transition hover:border-accent hover:shadow-[var(--shadow-card)]">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/5 text-primary group-hover:bg-accent group-hover:text-accent-foreground transition">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
