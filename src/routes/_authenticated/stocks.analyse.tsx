import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/stocks/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Stocks"
      description="Mouvements, transferts et inventaires"
      metrics={[
        { label: "Mouvements", table: "mouvements_stock" },
        { label: "Transferts", table: "transferts_stock" },
        { label: "Inventaires", table: "inventaires" },
        { label: "Dépôts", table: "depots" },
      ]}
      charts={[
        { title: "Mouvements par dépôt (top 10)", table: "mouvements_stock", groupBy: "depot_id", labelMap: { table: "depots", labelField: "nom" } },
        { title: "Mouvements par type", table: "mouvements_stock", groupBy: "type_mouvement", type: "pie" },
      ]}
    />
  ),
});
