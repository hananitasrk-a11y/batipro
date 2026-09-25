import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/ventes/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Ventes"
      description="Suivi du chiffre d'affaires et des règlements"
      metrics={[
        { label: "Devis", table: "devis" },
        { label: "Commandes", table: "commandes_vente" },
        { label: "CA facturé", table: "factures", aggregate: "sum", field: "montant_ttc", format: "money" },
        { label: "Encaissé", table: "reglements", aggregate: "sum", field: "montant", format: "money" },
      ]}
      charts={[
        { title: "Factures par client (top 10)", table: "factures", groupBy: "client_id", field: "montant_ttc", aggregate: "sum", labelMap: { table: "clients", labelField: "nom" } },
        { title: "Règlements par mode", table: "reglements", groupBy: "mode", field: "montant", aggregate: "sum", type: "pie" },
      ]}
    />
  ),
});
