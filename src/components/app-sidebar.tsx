import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2, LayoutDashboard, HardHat, ShoppingCart, BarChart3, Package, Users, Wrench, Truck, Wallet, Database,
  ChevronDown, FileText, FileSignature, Receipt, PackageCheck, ClipboardList, Clock, Banknote, CalendarOff, FileBadge,
  FileQuestion, Undo2, ReceiptText, ArrowLeftRight, CircleDollarSign, UserMinus, FileCog, Repeat, Fuel, AlertTriangle, CalendarClock, Route as RouteIcon, ArrowDownToLine, ArrowUpFromLine, Layers, ListChecks, FlaskConical, Gauge, Handshake, KeyRound, ScrollText, BookOpen, BookMarked, FileSpreadsheet, Scale, Landmark, FileBarChart2,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Sub = { title: string; url: string; icon?: React.ComponentType<{ className?: string }> };
type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }>; subs?: Sub[] };

const nav: NavItem[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Alertes", url: "/alertes", icon: AlertTriangle },
  {
    title: "Production", url: "/production", icon: HardHat, subs: [
      { title: "Chantiers", url: "/production", icon: HardHat },
      { title: "Phases", url: "/production/phases", icon: Layers },
      { title: "Tâches / Planning", url: "/production/taches", icon: ListChecks },
      { title: "Consommation constituants", url: "/production/consommation", icon: FlaskConical },
      { title: "Rendement journalier", url: "/production/rendement", icon: Gauge },
      { title: "Sous-traitance", url: "/production/soustraitance", icon: Handshake },
      { title: "Audit sous-traitance", url: "/production/soustraitance-audit", icon: ScrollText },
      { title: "Analyse", url: "/production/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Achats", url: "/achats", icon: ShoppingCart, subs: [
      { title: "Demandes de devis", url: "/achats/demandes", icon: FileQuestion },
      { title: "Bons de commande", url: "/achats", icon: ShoppingCart },
      { title: "Réceptions", url: "/achats/receptions", icon: PackageCheck },
      { title: "Factures", url: "/achats/factures", icon: FileText },
      { title: "Retours", url: "/achats/retours", icon: Undo2 },
      { title: "Avoirs", url: "/achats/avoirs", icon: ReceiptText },
      { title: "Règlements", url: "/achats/reglements", icon: Receipt },
      { title: "Analyse", url: "/achats/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Ventes", url: "/ventes", icon: BarChart3, subs: [
      { title: "Devis", url: "/ventes/devis", icon: FileSignature },
      { title: "Commandes", url: "/ventes/commandes", icon: ShoppingCart },
      { title: "Livraisons", url: "/ventes/livraisons", icon: Truck },
      { title: "Factures", url: "/ventes/factures", icon: FileText },
      { title: "Retours", url: "/ventes/retours", icon: Undo2 },
      { title: "Avoirs", url: "/ventes/avoirs", icon: ReceiptText },
      { title: "Règlements", url: "/ventes/reglements", icon: Receipt },
      { title: "Analyse", url: "/ventes/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Stocks", url: "/stocks", icon: Package, subs: [
      { title: "Mouvements", url: "/stocks", icon: Package },
      { title: "Transferts dépôts", url: "/stocks/transferts", icon: ArrowLeftRight },
      { title: "Inventaire", url: "/stocks/inventaire", icon: ClipboardList },
      { title: "Analyse", url: "/stocks/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Personnel", url: "/personnel", icon: Users, subs: [
      { title: "Employés", url: "/personnel", icon: Users },
      { title: "Pointage", url: "/personnel/pointage", icon: Clock },
      { title: "Avances", url: "/personnel/avances", icon: CircleDollarSign },
      { title: "Congés", url: "/personnel/conges", icon: CalendarOff },
      { title: "Absences", url: "/personnel/absences", icon: UserMinus },
      { title: "Paie", url: "/personnel/paie", icon: Banknote },
      { title: "Analyse", url: "/personnel/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Matériel", url: "/materiel", icon: Wrench, subs: [
      { title: "Engins", url: "/materiel", icon: Wrench },
      { title: "Documents", url: "/materiel/documents", icon: FileCog },
      { title: "Papiers", url: "/materiel/papiers", icon: FileBadge },
      { title: "Transferts", url: "/materiel/transferts", icon: Repeat },
      { title: "Entretiens", url: "/materiel/entretiens", icon: Wrench },
      { title: "Périodiques", url: "/materiel/periodiques", icon: CalendarClock },
      { title: "Gasoil", url: "/materiel/gasoil", icon: Fuel },
      { title: "Locations", url: "/materiel/locations", icon: Handshake },
      { title: "Pannes", url: "/materiel/pannes", icon: AlertTriangle },
      { title: "Analyse", url: "/materiel/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Transport", url: "/transport", icon: Truck, subs: [
      { title: "Véhicules", url: "/transport", icon: Truck },
      { title: "Suivi", url: "/transport/suivi", icon: RouteIcon },
      { title: "Analyse", url: "/transport/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Caisses", url: "/caisses", icon: Wallet, subs: [
      { title: "Liste", url: "/caisses", icon: Wallet },
      { title: "Alimentations", url: "/caisses/alimentations", icon: ArrowDownToLine },
      { title: "Dépenses", url: "/caisses/depenses", icon: ArrowUpFromLine },
      { title: "Analyse", url: "/caisses/analyse", icon: BarChart3 },
    ],
  },
  {
    title: "Comptabilité", url: "/comptabilite", icon: BookOpen, subs: [
      { title: "Plan comptable", url: "/comptabilite/plan", icon: BookMarked },
      { title: "Journaux", url: "/comptabilite/journaux", icon: BookOpen },
      { title: "Écritures", url: "/comptabilite/ecritures", icon: FileSpreadsheet },
      { title: "Grand livre", url: "/comptabilite/grand-livre", icon: Scale },
      { title: "Balance", url: "/comptabilite/balance", icon: FileBarChart2 },
      { title: "Rapprochement", url: "/comptabilite/rapprochement", icon: Landmark },
      { title: "États financiers", url: "/comptabilite/etats", icon: Receipt },
    ],
  },
];

const refs = [
  { title: "Référentiels", url: "/donnees", icon: Database },
  { title: "Utilisateurs & rôles", url: "/donnees/utilisateurs", icon: KeyRound },
  { title: "Journal d'activité", url: "/donnees/log", icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url;
  const isInBranch = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          {!collapsed && <div className="font-semibold text-sidebar-foreground">BatiPro</div>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Exploitation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((i) => {
                if (!i.subs || collapsed) {
                  return (
                    <SidebarMenuItem key={i.url}>
                      <SidebarMenuButton asChild isActive={isInBranch(i.url)} tooltip={i.title}>
                        <Link to={i.url}>
                          <i.icon className="h-4 w-4" />
                          <span>{i.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <Collapsible key={i.url} defaultOpen={isInBranch(i.url)} className="group/coll">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isInBranch(i.url)} tooltip={i.title}>
                          <i.icon className="h-4 w-4" />
                          <span>{i.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/coll:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {i.subs.map((s) => (
                            <SidebarMenuSubItem key={s.url + s.title}>
                              <SidebarMenuSubButton asChild isActive={isActive(s.url)}>
                                <Link to={s.url}>
                                  {s.icon && <s.icon className="h-3.5 w-3.5" />}
                                  <span>{s.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Paramétrage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {refs.map((i) => (
                <SidebarMenuItem key={i.url}>
                  <SidebarMenuButton asChild isActive={isInBranch(i.url)} tooltip={i.title}>
                    <Link to={i.url}>
                      <i.icon className="h-4 w-4" />
                      <span>{i.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
