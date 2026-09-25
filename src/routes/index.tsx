import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2, HardHat, Truck, Package, Users, Wrench, BarChart3, Wallet,
  ShoppingCart, ArrowRight, CheckCircle2, Database,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BatiPro — ERP BTP intégré pour entreprises de construction" },
      { name: "description", content: "Gérez chantiers, achats, ventes, stocks, personnel, matériel, transport et caisses dans un seul logiciel pensé pour le BTP." },
      { property: "og:title", content: "BatiPro — ERP BTP intégré" },
      { property: "og:description", content: "Le logiciel de gestion complet pour les entreprises de BTP." },
    ],
  }),
  component: Landing,
});

const modules = [
  { icon: HardHat, name: "Production", desc: "Suivi chantiers, rendement, planning, marge brute" },
  { icon: ShoppingCart, name: "Achats", desc: "Devis, commandes, réceptions, factures fournisseurs" },
  { icon: BarChart3, name: "Ventes", desc: "Devis, livraisons, factures, règlements clients" },
  { icon: Package, name: "Stocks", desc: "Mouvements multi-dépôts, inventaire, ruptures" },
  { icon: Users, name: "Personnel", desc: "Pointage par chantier, paie, congés, absences" },
  { icon: Wrench, name: "Matériel", desc: "Engins, entretiens, pannes, carburant" },
  { icon: Truck, name: "Transport", desc: "Étude, suivi, quantité transportée, gasoil" },
  { icon: Wallet, name: "Caisses", desc: "Alimentation, dépenses, situation par caisse" },
  { icon: Database, name: "Référentiels", desc: "Clients, fournisseurs, produits, utilisateurs" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#0b1622]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1622]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-[#3ec8cc] text-[#0b1622]">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight text-[#f2efe8]">BatiPro</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#modules" className="text-[#f2efe8]/70 hover:text-[#f2efe8]">Modules</a>
            <a href="#features" className="text-[#f2efe8]/70 hover:text-[#f2efe8]">Fonctionnalités</a>
            <a href="#contact" className="text-[#f2efe8]/70 hover:text-[#f2efe8]">Contact</a>
          </nav>
          <Link to="/auth" className="inline-flex items-center gap-1 rounded-md bg-[#3ec8cc] px-4 py-2 text-sm font-medium text-[#0b1622] hover:brightness-110">
            Se connecter <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b1622]">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(62,200,204,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-3xl text-[#f2efe8]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3ec8cc]/30 bg-[#3ec8cc]/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ec8cc]" />
              ERP intégré · 9 modules métier
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Le logiciel de gestion <br /><span className="text-[#3ec8cc]">pensé pour le BTP</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#f2efe8]/80">
              Pilotez vos chantiers, vos achats, votre matériel et votre personnel depuis une plateforme unique. De la demande de devis à la marge brute, tout est connecté.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-md bg-[#3ec8cc] px-6 py-3 font-semibold text-[#0b1622] shadow-[0_10px_30px_-10px_rgba(62,200,204,0.45)] hover:brightness-110">
                Démarrer maintenant <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#modules" className="inline-flex items-center gap-2 rounded-md border border-[#f2efe8]/30 bg-[#f2efe8]/5 px-6 py-3 font-medium text-[#f2efe8] backdrop-blur hover:bg-[#f2efe8]/10">
                Découvrir les modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section id="modules" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[#3ec8cc]">Architecture</p>
          <h2 className="mt-2 text-3xl font-bold text-[#f2efe8] md:text-4xl">9 modules. Une plateforme.</h2>
          <p className="mt-4 text-[#f2efe8]/70">Tous les processus d'une entreprise BTP, dans un système cohérent où les données circulent sans ressaisie.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.name} className="group rounded-xl border border-[#f2efe8]/10 bg-[#132234] p-6 transition hover:border-[#3ec8cc]/50 hover:shadow-[0_10px_30px_-10px_rgba(62,200,204,0.25)]">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[#3ec8cc]/10 text-[#3ec8cc] transition group-hover:bg-[#3ec8cc] group-hover:text-[#0b1622]">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[#f2efe8]">{m.name}</h3>
              <p className="mt-1 text-sm text-[#f2efe8]/60">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-[#f2efe8]/10 bg-[#132234]/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#3ec8cc]">Pourquoi BatiPro</p>
              <h2 className="mt-2 text-3xl font-bold text-[#f2efe8] md:text-4xl">Conçu pour le terrain.</h2>
              <p className="mt-4 text-[#f2efe8]/70">Les chefs de chantier saisissent le pointage et la consommation. La direction voit les KPIs en temps réel. Les comptables clôturent sans ressaisie.</p>
              <ul className="mt-8 space-y-3">
                {[
                  "Multi-utilisateurs avec rôles métier (Admin, Direction, Chef de chantier, RH, Comptable, Magasinier, Caissier)",
                  "Pointage par affaire et consommation des constituants par chantier",
                  "Suivi engins : documents, entretiens périodiques, pannes, carburant",
                  "Tableaux de bord et analyses par dépôt, chantier, période",
                  "Gestion multi-dépôts et multi-caisses",
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3ec8cc]" />
                    <span className="text-sm text-[#f2efe8]/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-[#f2efe8]/10 bg-[#0b1622] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-[#f2efe8]/10 pb-4">
                  <div>
                    <div className="text-xs text-[#f2efe8]/50">Tableau de bord</div>
                    <div className="font-semibold text-[#f2efe8]">Vue d'ensemble</div>
                  </div>
                  <div className="rounded-full bg-[#3ec8cc]/15 px-2 py-1 text-xs font-medium text-[#3ec8cc]">+12%</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { k: "Chantiers actifs", v: "18", c: "text-[#f2efe8]" },
                    { k: "CA du mois", v: "2.4 M DH", c: "text-[#3ec8cc]" },
                    { k: "Personnel", v: "127", c: "text-emerald-400" },
                    { k: "Engins", v: "32", c: "text-amber-400" },
                  ].map((kpi) => (
                    <div key={kpi.k} className="rounded-lg border border-[#f2efe8]/10 bg-[#132234] p-3">
                      <div className="text-xs text-[#f2efe8]/50">{kpi.k}</div>
                      <div className={`mt-1 text-xl font-bold ${kpi.c}`}>{kpi.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-32 rounded-lg bg-gradient-to-tr from-[#3ec8cc]/20 to-[#3ec8cc]/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-[#f2efe8] md:text-4xl">Prêt à structurer votre gestion ?</h2>
        <p className="mx-auto mt-4 max-w-xl text-[#f2efe8]/70">Créez votre compte et démarrez en quelques minutes.</p>
        <Link to="/auth" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#3ec8cc] px-6 py-3 font-semibold text-[#0b1622] hover:brightness-110">
          Démarrer <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-[#f2efe8]/10 bg-[#0b1622]">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-[#f2efe8]/50">
          © {new Date().getFullYear()} BatiPro — ERP BTP intégré
        </div>
      </footer>
    </div>
  );
}
