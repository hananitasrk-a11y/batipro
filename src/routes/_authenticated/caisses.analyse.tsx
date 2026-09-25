import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";

export const Route = createFileRoute("/_authenticated/caisses/analyse")({
  component: () => (
    <AnalyticsView
      title="Analyse Caisses"
      description="Flux de trésorerie par caisse"
      metrics={[
        { label: "Caisses", table: "caisses" },
        { label: "Opérations", table: "operations_caisse" },
        { label: "Total opérations", table: "operations_caisse", aggregate: "sum", field: "montant", format: "money" },
        { label: "Dépenses", table: "operations_caisse", aggregate: "sum", field: "montant", format: "money", filter: { type_operation: "depense" } },
      ]}
      charts={[
        { title: "Opérations par caisse", table: "operations_caisse", groupBy: "caisse_id", field: "montant", aggregate: "sum", labelMap: { table: "caisses", labelField: "nom" } },
        { title: "Opérations par type", table: "operations_caisse", groupBy: "type_operation", type: "pie" },
      ]}
    />
  ),
});
