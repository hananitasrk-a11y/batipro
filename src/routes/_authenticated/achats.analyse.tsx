import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/achats/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Achats"
      description="Suivi des dépenses fournisseurs"
      metrics={[
        { label: "Bons de commande", table: "bons_commande" },
        { label: "Réceptions", table: "receptions" },
        { label: "Factures achats", table: "factures", aggregate: "sum", field: "montant_ttc", format: "money" },
        { label: "Réglé fournisseurs", table: "reglements", aggregate: "sum", field: "montant", format: "money" },
      ]}
      charts={[
        { title: "Achats par fournisseur (top 10)", table: "bons_commande", groupBy: "fournisseur_id", field: "montant_ttc", aggregate: "sum", labelMap: { table: "fournisseurs", labelField: "nom" } },
        { title: "Bons de commande par statut", table: "bons_commande", groupBy: "statut", type: "pie" },
      ]}
    />
  ),
});
