import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookMarked, FileSpreadsheet, Scale, Landmark, FileBarChart2, Receipt } from "lucide-react";

const items = [
  { to: "/comptabilite/plan", title: "Plan comptable", icon: BookMarked, desc: "Comptes, classes, hiérarchie" },
  { to: "/comptabilite/journaux", title: "Journaux", icon: BookOpen, desc: "Ventes, achats, banque, caisse, OD" },
  { to: "/comptabilite/ecritures", title: "Écritures", icon: FileSpreadsheet, desc: "Saisie débit / crédit équilibrée" },
  { to: "/comptabilite/grand-livre", title: "Grand livre", icon: Scale, desc: "Détail des mouvements par compte" },
  { to: "/comptabilite/balance", title: "Balance", icon: FileBarChart2, desc: "Balance générale par période" },
  { to: "/comptabilite/rapprochement", title: "Rapprochement bancaire", icon: Landmark, desc: "Relevés vs écritures" },
  { to: "/comptabilite/etats", title: "États financiers", icon: Receipt, desc: "Bilan, compte de résultat, TVA" },
];

function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Comptabilité</h1>
        <p className="text-muted-foreground">Plan comptable, écritures, états financiers et rapprochement bancaire.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Link key={i.to} to={i.to}>
            <Card className="h-full transition hover:shadow-md hover:border-primary/40">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-md bg-primary/10 p-2 text-primary"><i.icon className="h-5 w-5" /></div>
                <CardTitle className="text-base">{i.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{i.desc}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/comptabilite/")({ component: Home });
